import uuid
from sqlalchemy import (
    create_engine,
    Column,
    String,
    Integer,
    Text,
    Boolean,
    DateTime,
    UUID,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import datetime

Base = declarative_base()


class CVAnalysis(Base):
    __tablename__ = "cv_analysis"

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(String, unique=True, nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    name = Column(String)
    email = Column(String)
    telp = Column(String)
    filename = Column(String)
    score = Column(Integer)  # overall_score
    explanation = Column(Text)

    # 🔽 Ubah dari Integer → Text (untuk simpan JSON string)
    hard_skill = Column(Text)  # Dulu: Integer
    experience = Column(Text)  # Dulu: Integer
    presentation_quality = Column(Text)  # Dulu: Integer

    # (Opsional) Kalau mau simpan highlights terpisah
    highlights = Column(
        Text, nullable=True
    )  # simpan: {"positive": [...], "negative": [...]}

    meets_minimum = Column(Boolean)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    # Relationship
    job = relationship("Job", back_populates="cv_analysis")


class Accounts(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    # Relasi ke Criteria

    # Relasi ke Job
    jobs = relationship("Job", back_populates="account", uselist=False)


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    position = Column(String)
    description = Column(Text)
    token = Column(String, unique=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    criteria = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    account = relationship("Accounts", back_populates="jobs")
    cv_analysis = relationship("CVAnalysis", back_populates="job", uselist=False)


# class Criteria(Base):
#     __tablename__ = "criteria"
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     criteria = Column(Text)
#     account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
#     created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
#     account = relationship("Accounts", back_populates="criteria")
#     jobs = relationship("Job", back_populates="criteria", uselist=False)


engine = create_engine("sqlite:///./hireco.db")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()


def save_cv_analysis_result(
    name,
    email,
    telp,
    job_id,
    file_id,
    filename,
    score,
    explanation,
    experience,
    hard_skill,
    presentation_quality,
    metadata,
):
    hard_skill_json = json.dumps(hard_skill)  # dict → str
    experience_json = json.dumps(experience)  # dict → str
    pq_json = json.dumps(presentation_quality)  # dict → str
    highlights_json = json.dumps(
        metadata.get("highlights", {})
    )  # dari result["highlights"]
    try:
        record = CVAnalysis(
            file_id=file_id,
            job_id=job_id,
            name=name,
            email=email,
            telp=telp,
            filename=filename,
            score=score,
            explanation=explanation,
            hard_skill=hard_skill_json,
            experience=experience_json,
            presentation_quality=pq_json,
            highlights=highlights_json,
            meets_minimum=metadata.get("meets_minimum", False),
        )
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
    finally:
        db.close()


def save_account(email, password, role):
    try:
        record = Accounts(email=email, password=password, role=role)
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
    finally:
        db.close()


def get_db():
    try:
        yield db
    finally:
        db.close()
