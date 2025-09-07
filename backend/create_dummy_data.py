# Run this script once to populate your database with initial data.
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models, crud, schemas
from app.models import UserRole
import datetime

# Create tables
models.Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

try:
    # --- Create Users ---
    teacher1 = crud.create_user(db, schemas.UserCreate(username="prof.x", full_name="Professor Xavier", password="password123", role=UserRole.teacher))
    student1 = crud.create_user(db, schemas.UserCreate(username="student.a", full_name="Student Alpha", password="password123", role=UserRole.student))
    student2 = crud.create_user(db, schemas.UserCreate(username="student.b", full_name="Student Bravo", password="password123", role=UserRole.student))
    print("Created users.")

    # --- Create Subjects ---
    sc = models.Subject(name="Soft Computing", code="SC")
    nwt = models.Subject(name="Networking and Web Technology", code="NWT")
    ssic = models.Subject(name="Soft Skills", code="SSIC")
    ml = models.Subject(name="Machine Learning", code="ML")
    at = models.Subject(name="Automata Theory", code="AT")
    db.add_all([sc, nwt, ssic, ml, at])
    db.commit()
    print("Created subjects.")

    # --- Create Timetable Slots (for Professor Xavier) ---
    timetable = [
        # Monday
        models.TimetableSlot(subject_id=sc.id, teacher_id=teacher1.id, day_of_week=0, start_time=datetime.time(10, 30), end_time=datetime.time(11, 30)),
        models.TimetableSlot(subject_id=nwt.id, teacher_id=teacher1.id, day_of_week=0, start_time=datetime.time(12, 0), end_time=datetime.time(13, 0)),
        # Tuesday
        models.TimetableSlot(subject_id=at.id, teacher_id=teacher1.id, day_of_week=1, start_time=datetime.time(10, 30), end_time=datetime.time(11, 30)),
        # Add more as needed...
    ]
    db.add_all(timetable)
    db.commit()
    print("Created timetable slots.")

    print("\nDummy data created successfully!")
    print("Teacher Login: prof.x / password123")
    print("Student Logins: student.a / password123, student.b / password123")

finally:
    db.close()
