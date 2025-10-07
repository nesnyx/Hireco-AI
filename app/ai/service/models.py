import uuid
from sqlalchemy import (
    Float,
    create_engine,
    Column,
    String,
    Integer,
    Text,
    Boolean,
    DateTime,
    UUID,
    func,
    Index,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import datetime

Base = declarative_base()


def gen_uuid_str():
    return str(uuid.uuid4())


class Accounts(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    role = Column(String, nullable=True)
    provider = Column(String, default="email")  # "email", "google", etc.
    oauth_id = Column(String, nullable=True)
    profile = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    jobs = relationship(
        "Job",
        back_populates="account",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    feedbacks = relationship("UserFeedback", back_populates="account")


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=True)
    position = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    token = Column(String, unique=True, index=True, nullable=True)
    account_id = Column(
        Integer,
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    criteria = Column(Text, nullable=False)  # initial criteria JSON / raw
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    account = relationship("Accounts", back_populates="jobs")
    cv_analysis = relationship(
        "CVAnalysis",
        back_populates="job",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    criteria_items = relationship(
        "JobCriteria", back_populates="job", cascade="all, delete-orphan"
    )


class CVAnalysis(Base):
    __tablename__ = "cv_analysis"
    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(
        String, unique=True, nullable=False, index=True
    )  # external file uuid
    job_id = Column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Candidate basic metadata (if available)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True, index=True)
    telp = Column(String, nullable=True)
    filename = Column(String, nullable=True)

    # Scores
    score = Column(Float, nullable=True)  # overall_score (0-100)
    explanation = Column(Text, nullable=True)

    # JSON fields stored as text strings (store JSON.dump before save)
    hard_skill = Column(Text, nullable=True)  # store JSON string
    experience = Column(Text, nullable=True)
    presentation_quality = Column(Text, nullable=True)

    highlights = Column(
        Text, nullable=True
    )  # e.g. {"positive": [...], "negative": [...]}
    meets_minimum = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="cv_analysis")
    criteria_matches = relationship(
        "CriteriaMatchDetail",
        back_populates="cv_analysis",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    feedbacks = relationship("UserFeedback", back_populates="cv_analysis")


class CVFile(Base):
    __tablename__ = "cv_files"
    id = Column(String, primary_key=True, default=gen_uuid_str)  # UUID string
    file_id = Column(
        String, unique=True, index=True, nullable=True
    )  # mirror of CVAnalysis.file_id if used
    user_email = Column(String, nullable=True, index=True)
    job_id = Column(
        Integer, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True, index=True
    )
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class EmbeddingIndex(Base):
    __tablename__ = "embedding_index"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ref_id = Column(
        String, nullable=False, index=True
    )  # CV file_id or job_criteria id etc.
    type = Column(String, nullable=False, index=True)  # "cv_chunk" | "criteria" | "job"
    vector_id = Column(String, nullable=False, index=True)  # id in Milvus
    meta_data = Column(Text, nullable=True)  # optional JSON metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class JobCriteria(Base):
    __tablename__ = "job_criteria"
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name = Column(String, nullable=False)  # e.g. "Java"
    description = Column(Text, nullable=True)
    weight = Column(Float, default=1.0)
    expected_level = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="criteria_items")
    match_details = relationship(
        "CriteriaMatchDetail",
        back_populates="criteria",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class CriteriaMatchDetail(Base):
    __tablename__ = "criteria_match_detail"
    id = Column(Integer, primary_key=True, autoincrement=True)
    cv_analysis_id = Column(
        Integer,
        ForeignKey("cv_analysis.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    criteria_id = Column(
        Integer,
        ForeignKey("job_criteria.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    similarity_score = Column(Float, nullable=True)  # cosine / normalized score
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    cv_analysis = relationship("CVAnalysis", back_populates="criteria_matches")
    criteria = relationship("JobCriteria", back_populates="match_details")


class UserFeedback(Base):
    __tablename__ = "user_feedback"
    id = Column(Integer, primary_key=True, autoincrement=True)
    cv_analysis_id = Column(
        Integer,
        ForeignKey("cv_analysis.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    account_id = Column(
        Integer,
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    rating = Column(Integer, nullable=True)  # 1-5 scale
    comment = Column(Text, nullable=True)
    agree_with_ai = Column(Boolean, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cv_analysis = relationship("CVAnalysis", back_populates="feedbacks")
    account = relationship("Accounts", back_populates="feedbacks")


class AnalyticsLog(Base):
    __tablename__ = "analytics_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(
        String, nullable=False, index=True
    )  # e.g. "CV_ANALYSIS", "JOB_CREATED"
    meta_data = Column(Text, nullable=True)  # JSON string
    duration_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())



Index("ix_embedding_ref_type", EmbeddingIndex.ref_id, EmbeddingIndex.type)
Index("ix_cv_job_file", CVAnalysis.job_id, CVAnalysis.file_id)

engine = create_engine("sqlite:///./hireco.db", echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
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
