from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routers import auth, teacher, student

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Middleware Setup
# Replace "http://localhost:3000" with your Next.js frontend URL
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:63442",
    "http://localhost:9002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(teacher.router)
app.include_router(student.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Attendance System API"}
