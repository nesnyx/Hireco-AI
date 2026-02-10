from app.core.events import ee, ANALYSIS_STARTED
from app.models.models import db
from app.repositories._applicant_repository import ApplicantRepository
from app.repositories._subscription_credit_repository import SubscriptionCreditRepository
from app.repositories._user_subscription_repository import UserSubscriptionRepository
from app.schemas.applicant_schema import CreateApplicantSchema
import logging
from app.services.subscription_credit_service import SubscriptionCreditService
from app.services.user_subscription_service import UserSubscriptionService

logger = logging.getLogger(__name__)

@ee.on(ANALYSIS_STARTED)
async def handle_pdf_analysis(payload: dict, loader_pdf_func,applicant_id,account_id):
    logger.info(f"🚀 Memulai processing untuk file_id: {payload['file_id']}")
    file_id = payload["file_id"]
    file_path = payload["file_path"]
    filename = payload["filename"]
    job_id = payload["job_id"]
    try:
        applicant_repository = ApplicantRepository(db_session=db)
        subscription_credit_repo = SubscriptionCreditRepository(db_session=db)
        subscription_repo = UserSubscriptionRepository(db_session=db)
        subscription_service = UserSubscriptionService(user_subscription_repository=subscription_repo)
        subscription_credit_service = SubscriptionCreditService(credit_repository=subscription_credit_repo)
        existing_user_subscription=subscription_service.find_user_subscription(account_id=account_id)
        credit_subscription = subscription_credit_service.find_by_subscription_id(existing_user_subscription.id)
        
        processed_results = []
        result = await loader_pdf_func(
            job_id=job_id,
            file_path=file_path,
            file_name=filename,
            criteria=payload["criteria"],
            file_id=file_id,
        )
        applicant_name = result.get("name", "N/A")
        applicant_email = result.get("email", "N/A")
        applicant_telp = result.get("phone", "N/A")
        processed_results.append(
                {
                    "file_id": file_id,
                    "filename": filename,
                    "score": result["overall_score"],
                    "name": applicant_name,
                    "email": applicant_email,
                    "status": "success",
                }
            )
        payload = CreateApplicantSchema(
            file_id=file_id,
            name=applicant_name,
            email=applicant_email,
            telp=applicant_telp,
            filename=str(file_path),
            score=result["overall_score"],
            explanation=result["explanation"],
            experience=result["experience"],
            presentation_quality=result["presentation_quality"],
            hard_skill=result["hard_skill"],
            job_id=job_id,
            account_id=account_id
        )
        applicant_repository.update(file_id,payload,"COMPLETED")
        subscription_credit_service.update(subscription_id=existing_user_subscription.id,amount=credit_subscription.amount)
        db.commit()
        logging.info(f"✅ Selesai processing untuk file_id: {file_id}")
    except Exception as e:
        logging.error(f"❌ Gagal processing untuk file_id: {file_id}. Error: {str(e)}")
        applicant_repository.delete(id=applicant_id)
        db.rollback()