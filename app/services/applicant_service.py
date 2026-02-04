from pathlib import Path
from typing import List
import uuid, asyncio
from concurrent.futures import ProcessPoolExecutor
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import UploadFile
from app.core.vectoredb import upsert_applicant_to_vectordb,vectorstore
from app.helper.error_handling import JobNotFound
from app.repositories._applicant_repository import ApplicantRepository
from app.core.prompt import PROMPT_TEMPLATE
from app.schemas.applicant_schema import CreateApplicantSchema
from app.services.hr_service import HrService
from langchain_core.prompts import ChatPromptTemplate
from app.utils.llm import llm
from langchain_core.output_parsers import JsonOutputParser
from app.core.events import ee, ANALYSIS_STARTED

executor = ProcessPoolExecutor()

def heavy_pdf_logic(file_path : str):
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=30,separators=["\n\n", "\n", ".", " "])
        return text_splitter.split_documents(docs)
    

class ApplicantService:
    def __init__(self,applicant_repository : ApplicantRepository,hr_service : HrService):
        self._applicant_repository = applicant_repository
        self._hr_service = hr_service
    
    async def _loader_pdf(self,job_id,file_path, file_name, criteria, file_id):
        loop = asyncio.get_event_loop()
        try:
            split_texts = await loop.run_in_executor(executor, heavy_pdf_logic, file_path)
        except Exception as e:
            raise ValueError("Invalid PDF")
        
        
        metadatas = {
            "job_id": job_id,
            "file_id": file_id,
            "source": file_path,
            "file_name": file_name,
            "type": "cv",
        }
        
        for doc in split_texts:
            doc.metadata.update(metadatas)
            
        await upsert_applicant_to_vectordb(
            documents=split_texts, file_id=file_id, vectorstore=vectorstore
            )
        result = await self.analyze_cv_with_criteria(
        job_id=job_id,
        vector_db=vectorstore,
        file_id=file_id,
        criteria=criteria,
        type="cv",
        source=file_path,

        )
        return result
    
    async def analyze(self,job_id : str,file:UploadFile):
        UPLOAD_DIR = Path("uploads")
        UPLOAD_DIR.mkdir(exist_ok=True)
        job = self._hr_service.find_by_id(id=job_id)           
        if not job:
            raise JobNotFound()         
        file_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{file_id}.pdf"                  
        with open(file_path, "wb") as f:
            f.write(await file.read())
        event_payload = {
            "job_id": job_id,
            "file_id": file_id,
            "file_path": str(file_path),
            "criteria": job.criteria,
            "filename": file.filename,
        }
        paylaod = CreateApplicantSchema(
            job_id=job_id,
            filename=file.filename,
            file_id= file_id
        )
        self._applicant_repository.save(payload=paylaod)
        ee.emit(ANALYSIS_STARTED, event_payload, self._loader_pdf)
        return {
            "status": "processing",
            "file_id": file_id,
            "message": "Analisis dimulai di background"
        }
    
    
    
    async def analyze_batch(self,job_id : str,files:List[UploadFile]):
        UPLOAD_DIR = Path("uploads")
        UPLOAD_DIR.mkdir(exist_ok=True)
        processed_results = []
        data = []
        job = self._hr_service.find_by_id(id=job_id)           
        if not job:
            raise JobNotFound()         
        for file in files:
            file_id = str(uuid.uuid4())
            file_path = UPLOAD_DIR / f"{file_id}.pdf"                  
            self._save_file_pdf(file_path=file_path,file=file)
            result = await self._loader_pdf(
                job_id=job_id,
                file_id=file_id,
                file_path=str(file_path),
                file_name=file.filename,
                criteria=job.criteria,
            )
            applicant_name = result.get("name", "N/A")
            applicant_email = result.get("email", "N/A")
            applicant_telp = result.get("phone", "N/A")
            processed_results.append(
                {
                    "file_id": file_id,
                    "filename": file.filename,
                    "score": result["overall_score"],
                    "name": applicant_name,
                    "email": applicant_email,
                    "status": "success",
                }
            )
            payload = {
                "file_id":file_id,
                "name":applicant_name,
                "email":applicant_email,
                "telp":applicant_telp,
                "filename":str(file_path),
                "score":result["overall_score"],
                "explanation":result["explanation"],
                "experience":result["experience"],
                "presentation_quality":result["presentation_quality"],
                "hard_skill":result["hard_skill"],
                "metadata":result.get("metadata", {})
            }
            data.append(payload)
        
        self._applicant_repository.save(data=data)
        return processed_results


    

    async def _save_file_pdf(self,file_path:str,file):
        saved_file_paths = (
            []
        )
        try:
            with open(file_path, "wb") as f:
                    content = await file.read()
                    f.write(content)
            saved_file_paths.append(file_path)
            return saved_file_paths
        except Exception as e:
            for path in saved_file_paths:
                if path.exists():
                    try:
                        path.unlink()
                    except Exception as err:
                        raise err
            raise e
        
    async def analyze_cv_with_criteria(self,job_id, vector_db, criteria, type, source, file_id):
        retriever = vector_db.as_retriever(
            search_kwargs={
                "k": 10,
                "filter": {
                    "$and": [
                        {"file_id": {"$eq": file_id}},
                        {"job_id": {"$eq": job_id}},
                        {"type": {"$eq": type}},
                        {"source": {"$eq": source}},
                        
                    ]
                },
            }
        )

        relevant_context = await retriever.ainvoke(
            "Fokus pada tiga aspek utama: pengalaman kerja (relevansi, durasi, pencapaian), kemampuan teknis atau hard skills (kedalaman dan relevansi skill), serta kualitas penyajian CV (kejelasan kalimat, struktur, dan profesionalitas bahasa). Berikan analisis yang objektif, rinci, dan detail namun tetap ringkas serta efisien untuk membantu HR dalam pengambilan keputusan."
        )
        context_str = "\n\n".join([doc.page_content for doc in relevant_context])
        prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        chain = prompt | llm | JsonOutputParser()

        try:
            result = await chain.ainvoke({"cv_text": context_str, "criteria": criteria})
            return result
        except Exception as e:

            return {
                "hard_skill": {"score": 0, "feedback": ""},
                "experience": {"score": 0, "feedback": ""},
                "presentation_quality": {
                    "score": 0,
                    "issues": [],
                    "highlight_negative": [],
                },
                "overall_score": 0,
                "explanation": "Gagal menganalisis CV. Terjadi kesalahan pada AI.",
                "meets_minimum": False,
                "highlights": {"positive": [], "negative": []},
            }

    def find_all(self):
        return self._applicant_repository.get_all()
    
    def remove(self,id:str):
        return self._applicant_repository.delete(id=id)
    
    def update(self, payload : CreateApplicantSchema,status :str):
        return self._applicant_repository.update(payload)