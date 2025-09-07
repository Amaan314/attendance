from fastapi import APIRouter, Depends, HTTPException, status
from redis import Redis
from sqlalchemy.orm import Session
import json

from .. import auth, crud, models, schemas
from ..database import get_db, get_redis
from .teacher import manager # Import the connection manager

router = APIRouter(
    prefix="/student",
    tags=["Student"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/attendance/scan")
async def scan_attendance(
    payload: schemas.AttendanceScanPayload,
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != models.UserRole.student:
        raise HTTPException(status_code=403, detail="Only students can scan for attendance")
    
    # 1. Verify Token
    valid_token = redis_client.get(f"qr_token:{payload.session_id}")
    if not valid_token or valid_token.decode() != payload.token:
        raise HTTPException(status_code=400, detail="Invalid or expired QR code")
    
    # 2. Get lecture ID for this session
    slot_id = redis_client.get(f"session_slot:{payload.session_id}")
    if not slot_id:
        raise HTTPException(status_code=404, detail="Attendance session not found")

    # 3. Check for duplicates
    if crud.check_if_already_marked(db, student_id=current_user.id, session_id=payload.session_id):
        raise HTTPException(status_code=409, detail="Attendance already marked for this session")

    # 4. Mark attendance
    record = crud.create_attendance_record(
        db,
        student_id=current_user.id,
        slot_id=int(slot_id),
        session_id=payload.session_id
    )

    # 5. Notify teacher via WebSocket
    student_data = {
        "id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.username
    }
    await manager.broadcast_to_session(json.dumps(student_data), payload.session_id)

    return {"status": "success", "message": "Attendance marked successfully"}
