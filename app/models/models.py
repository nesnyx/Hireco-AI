import uuid,json
from app.core.env import env_config
from sqlalchemy import (
    Column, String, Integer, Text, Boolean, DateTime, 
    Float, ForeignKey,  create_engine, func
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
Base = declarative_base()

# --- UTILS ---
def gen_uuid():
    return uuid.uuid4()

# --- MODELS ---

class Accounts(Base):
    __tablename__ = "accounts"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)
    provider = Column(String(50), default="email")
    oauth_id = Column(String(255), nullable=True)
    profile = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    jobs = relationship("Job", back_populates="accounts", cascade="all, delete-orphan")
    feedbacks = relationship("UserFeedback", back_populates="accounts")
    subscriptions = relationship("UserSubscription", back_populates="accounts", cascade="all, delete-orphan")
    account_roles = relationship("AccountRole", back_populates="account", cascade="all, delete-orphan",uselist=False)


class AccountRole(Base):
    __tablename__ = "account_roles"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    account_id = Column(PG_UUID, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, unique=True)
    role_id = Column(PG_UUID, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    account = relationship("Accounts", back_populates="account_roles")
    role = relationship("Role", back_populates="account_roles")

class Role(Base):
    __tablename__ = "roles"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    name = Column(String(50), index=True, nullable=False)
    account_roles = relationship("AccountRole", back_populates="role")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    title = Column(String(255))
    position = Column(String(255))
    description = Column(Text)
    token = Column(String(100), unique=True, index=True)
    account_id = Column(PG_UUID, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Menggunakan JSONB agar criteria bisa di-query secara efisien di Postgres
    criteria = Column(JSONB, nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    accounts = relationship("Accounts", back_populates="jobs")
    cv_analyses = relationship("CVAnalysis", back_populates="jobs", cascade="all, delete-orphan")
    criteria_items = relationship("JobCriteria", back_populates="jobs", cascade="all, delete-orphan")


class CVAnalysis(Base):
    __tablename__ = "cv_analysis"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    file_id = Column(String(100), unique=True, nullable=False, index=True)
    job_id = Column(PG_UUID, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)

    # Metadata
    name = Column(String(255))
    email = Column(String(255), index=True)
    telp = Column(String(50))
    filename = Column(String(255))

    # Scores
    score = Column(Float)
    explanation = Column(Text)
    hard_skill = Column(JSONB)
    experience = Column(JSONB)
    presentation_quality = Column(JSONB)
    highlights = Column(JSONB) 
    
    status = Column(String(50), default="PROCCESED", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    jobs = relationship("Job", back_populates="cv_analyses")
    criteria_matches = relationship("CriteriaMatchDetail", back_populates="cv_analysis", cascade="all, delete-orphan")
    feedbacks = relationship("UserFeedback", back_populates="cv_analysis")


class CVFile(Base):
    __tablename__ = "cv_files"
    
    # Gunakan Native Postgres UUID
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    file_id = Column(String(100), unique=True, index=True)
    user_email = Column(String(255), index=True)
    job_id = Column(PG_UUID, ForeignKey("jobs.id", ondelete="SET NULL"), index=True)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


class EmbeddingIndex(Base):
    __tablename__ = "embedding_index"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    ref_id = Column(String(100), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True) # "cv_chunk", "criteria"
    vector_id = Column(String(100), nullable=False, index=True)
    meta_data = Column(JSONB) # Lebih fleksibel untuk metadata vector
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class JobCriteria(Base):
    __tablename__ = "job_criteria"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    job_id = Column(PG_UUID, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    weight = Column(Float, default=1.0)
    expected_level = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    jobs = relationship("Job", back_populates="criteria_items")
    match_details = relationship("CriteriaMatchDetail", back_populates="criteria", cascade="all, delete-orphan")


class CriteriaMatchDetail(Base):
    __tablename__ = "criteria_match_detail"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    cv_analysis_id = Column(PG_UUID, ForeignKey("cv_analysis.id", ondelete="CASCADE"), nullable=False, index=True)
    criteria_id = Column(PG_UUID, ForeignKey("job_criteria.id", ondelete="CASCADE"), nullable=False, index=True)
    similarity_score = Column(Float)
    explanation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cv_analysis = relationship("CVAnalysis", back_populates="criteria_matches")
    criteria = relationship("JobCriteria", back_populates="match_details")


class UserFeedback(Base):
    __tablename__ = "user_feedback"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    cv_analysis_id = Column(PG_UUID, ForeignKey("cv_analysis.id", ondelete="CASCADE"), nullable=False, index=True)
    account_id = Column(PG_UUID, ForeignKey("accounts.id", ondelete="SET NULL"), index=True)
    rating = Column(Integer)
    comment = Column(Text)
    agree_with_ai = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cv_analysis = relationship("CVAnalysis", back_populates="feedbacks")
    accounts = relationship("Accounts", back_populates="feedbacks")


class Pricing(Base):
    __tablename__ = "pricing"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price_per_month = Column(Float, nullable=False)
    expires_in_days = Column(Integer, nullable=False)
    max_jobs = Column(Integer)
    features = Column(JSONB,nullable=True) # Simpan list fitur dalam format JSON
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    subscriptions = relationship("UserSubscription", back_populates="pricing")


class UserSubscription(Base):
    __tablename__ = "user_subscription"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    account_id = Column(PG_UUID, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    pricing_id = Column(PG_UUID, ForeignKey("pricing.id", ondelete="SET NULL"), index=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    accounts = relationship("Accounts", back_populates="subscriptions")
    pricing = relationship("Pricing", back_populates="subscriptions")


class AnalyticsLog(Base):
    __tablename__ = "analytics_log"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=gen_uuid)
    event_type = Column(String(100), nullable=False, index=True)
    meta_data = Column(JSONB) # Jauh lebih baik untuk analytics
    duration_ms = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

DB_URL = env_config.get("DATABASE_URL")

engine = create_engine(DB_URL, echo=False, pool_size=10, max_overflow=20)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

db = SessionLocal()


def get_db():
    try:
        yield db
    finally:
        db.close()
