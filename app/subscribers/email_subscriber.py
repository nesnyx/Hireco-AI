import logging
from app.core.events import ee, SEND_EMAIL
logger = logging.getLogger(__name__)


@ee.listeners(SEND_EMAIL)
async def handle_send_email():
    pass