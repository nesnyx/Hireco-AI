from app.core.events import ee, ANALYSIS_STARTED


@ee.on(ANALYSIS_STARTED)
async def handle_pdf_analysis(payload: dict, applicant_repository, loader_pdf_func):
    try:
        # Panggil fungsi berat kamu di sini
        result = await loader_pdf_func(
            job_id=payload["job_id"],
            file_id=payload["file_id"],
            file_path=payload["file_path"],
            criteria=payload["criteria"]
        )
        
        # Simpan hasil ke database
        # applicant_repository.save(result)
        print(f"✅ Background process selesai untuk {payload['file_id']}")
    except Exception as e:
        print(f"❌ Error saat processing: {e}")