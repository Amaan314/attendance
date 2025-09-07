# import uuid
# import asyncio
# from datetime import date
# from typing import List, Dict

# from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
# from redis import Redis
# from sqlalchemy.orm import Session

# from .. import auth, crud, models, schemas
# from ..database import get_db, get_redis

# router = APIRouter(
#     prefix="/teacher",
#     tags=["Teacher"],
#     dependencies=[Depends(auth.get_current_active_teacher)]
# )

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: Dict[str, WebSocket] = {}

#     async def connect(self, websocket: WebSocket, session_id: str):
#         await websocket.accept()
#         self.active_connections[session_id] = websocket

#     def disconnect(self, session_id: str):
#         if session_id in self.active_connections:
#             del self.active_connections[session_id]

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)
    
#     async def broadcast_to_session(self, message: str, session_id: str):
#         if session_id in self.active_connections:
#             await self.active_connections[session_id].send_text(message)

# manager = ConnectionManager()

# @router.get("/lectures", response_model=List[schemas.TimetableSlot])
# def get_teacher_lectures_for_date(
#     selected_date: date,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(auth.get_current_active_teacher)
# ):
#     day_of_week = selected_date.weekday()
#     return crud.get_lectures_by_day(db, day_of_week=day_of_week, teacher_id=current_user.id)

# @router.post("/attendance/start")
# def start_attendance_session(
#     slot_id: int,
#     redis_client: Redis = Depends(get_redis)
# ):
#     session_id = str(uuid.uuid4())
#     token = str(uuid.uuid4())
    
#     # Store token and associated lecture (slot_id) in Redis
#     redis_client.set(f"qr_token:{session_id}", token, ex=20) # ex=20 -> expires in 20 seconds
#     redis_client.set(f"session_slot:{session_id}", slot_id)
    
#     return {"session_id": session_id, "initial_token": token}

# @router.get("/attendance/qr/{session_id}")
# def refresh_qr_token(session_id: str, redis_client: Redis = Depends(get_redis)):
#     if not redis_client.exists(f"session_slot:{session_id}"):
#         raise HTTPException(status_code=404, detail="Attendance session not found or expired")

#     new_token = str(uuid.uuid4())
#     redis_client.set(f"qr_token:{session_id}", new_token, ex=20)
#     return {"token": new_token}

# @router.websocket("/ws/attendance/{session_id}")
# async def websocket_endpoint(websocket: WebSocket, session_id: str):
#     await manager.connect(websocket, session_id)
#     try:
#         while True:
#             # Keep connection alive
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         manager.disconnect(session_id)

import uuid
import asyncio
from datetime import date
from typing import List, Dict

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, Query, status
from redis import Redis
from sqlalchemy.orm import Session

from .. import auth, crud, models, schemas
from ..database import get_db, get_redis

# --- NEW: WebSocket-specific authenticator ---
# This function will be used ONLY by the websocket endpoint.
# It looks for the token in a query parameter instead of a header.
async def get_current_user_from_query(
    token: str = Query(...), 
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(token=token, db=db)
    if user.role != models.UserRole.teacher:
        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION, reason="Not authorized")
    return user


# --- MODIFIED: Router definition ---
# We REMOVE the global dependency from the router itself.
router = APIRouter(
    prefix="/teacher",
    tags=["Teacher"]
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
    
    async def broadcast_to_session(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

manager = ConnectionManager()

# --- MODIFIED: Add the dependency directly to the HTTP routes ---
@router.get("/lectures", response_model=List[schemas.TimetableSlot], dependencies=[Depends(auth.get_current_active_teacher)])
def get_teacher_lectures_for_date(
    selected_date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_teacher)
):
    day_of_week = selected_date.weekday()
    return crud.get_lectures_by_day(db, day_of_week=day_of_week, teacher_id=current_user.id)

@router.post("/attendance/start", dependencies=[Depends(auth.get_current_active_teacher)])
def start_attendance_session(
    slot_id: int,
    redis_client: Redis = Depends(get_redis)
):
    session_id = str(uuid.uuid4())
    token = str(uuid.uuid4())
    
    redis_client.set(f"qr_token:{session_id}", token, ex=20)
    redis_client.set(f"session_slot:{session_id}", slot_id)
    
    return {"session_id": session_id, "initial_token": token}

@router.get("/attendance/qr/{session_id}", dependencies=[Depends(auth.get_current_active_teacher)])
def refresh_qr_token(session_id: str, redis_client: Redis = Depends(get_redis)):
    if not redis_client.exists(f"session_slot:{session_id}"):
        raise HTTPException(status_code=404, detail="Attendance session not found or expired")

    new_token = str(uuid.uuid4())
    redis_client.set(f"qr_token:{session_id}", new_token, ex=20)
    return {"token": new_token}

# --- MODIFIED: WebSocket endpoint now uses its own authenticator ---
@router.websocket("/ws/attendance/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    # This dependency will now be resolved from the query parameter
    user: models.User = Depends(get_current_user_from_query) 
):
    await manager.connect(websocket, session_id)
    try:
        while True:
            # Keep connection alive
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(session_id)

