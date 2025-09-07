from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_lectures_by_day(db: Session, day_of_week: int, teacher_id: int):
    return db.query(models.TimetableSlot).filter(
        models.TimetableSlot.day_of_week == day_of_week,
        models.TimetableSlot.teacher_id == teacher_id
    ).all()

def check_if_already_marked(db: Session, student_id: int, session_id: str):
    return db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.student_id == student_id,
        models.AttendanceRecord.session_id == session_id
    ).first() is not None

def create_attendance_record(db: Session, student_id: int, slot_id: int, session_id: str):
    db_record = models.AttendanceRecord(
        student_id=student_id,
        slot_id=slot_id,
        session_id=session_id
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record
