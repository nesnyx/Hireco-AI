from sqlalchemy.orm import Session

class PaymentRepository:
    def __init__(self,db_session : Session):
        self._db_session = db_session