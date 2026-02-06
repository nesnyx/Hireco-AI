import logging
from app.core.events import ee, SEND_EMAIL
from app.repositories._registration_token_repository import RegistrationTokenRepository
from app.services.email_service import send_registration_mail
from app.models.models import db
logger = logging.getLogger(__name__)


@ee.on(SEND_EMAIL)
async def handle_send_email(email,token):
    registration_token_repository = RegistrationTokenRepository(db_session=db)
    try:
        await send_registration_mail(email,token)
        logger.info(f"Send Verification Token to {email} Success")
    except Exception as e:
        registration_token_repository.delete_by_token(token)
        logger.info(f"Send Verification Token to {email} Failed ")