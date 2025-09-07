from sqlalchemy import Column, Integer, String, ForeignKey, Time, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class UserRole(enum.Enum):
    teacher = "teacher"
    student = "student"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False) # 0=Monday, 1=Tuesday...
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    subject = relationship("Subject")
    teacher = relationship("User")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("timetable_slots.id"), nullable=False)
    session_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("User")
    slot = relationship("TimetableSlot")
