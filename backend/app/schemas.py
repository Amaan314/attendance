from pydantic import BaseModel
from typing import List
import datetime
from .models import UserRole

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str
    role: UserRole

class User(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# --- Timetable Schemas ---
class Subject(BaseModel):
    id: int
    name: str
    code: str

    class Config:
        from_attributes = True

class TimetableSlot(BaseModel):
    id: int
    day_of_week: int
    start_time: datetime.time
    end_time: datetime.time
    subject: Subject
    
    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceScanPayload(BaseModel):
    token: str
    session_id: str

class LiveAttendanceUpdate(BaseModel):
    student_name: str
    timestamp: datetime.datetime
