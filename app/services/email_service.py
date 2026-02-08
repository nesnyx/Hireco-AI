from fastapi_mail import FastMail,MessageSchema,ConnectionConfig, MessageType
from app.core.env import env_config


conf = ConnectionConfig(
    MAIL_USERNAME=env_config["GMAIL_APP_EMAIL"],
    MAIL_PASSWORD=env_config["GMAIL_APP_PASSWORD"],
    MAIL_FROM=env_config["GMAIL_APP_EMAIL"],
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_registration_mail(email: str, token : str):
    verify_url = env_config['VERIFY_URL']+token
    message = MessageSchema(
        subject="Verifikasi Akun Kamu",
        recipients=[email],
        body=f"Link verification {verify_url}",
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)