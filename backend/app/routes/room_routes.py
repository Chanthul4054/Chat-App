from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Room, RoomMember, Message
from ..schemas import RoomCreate, RoomResponse, MessageResponse
from ..deps import get_current_user

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.post("/", response_model=RoomResponse)
def create_room(room_data: RoomCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = db.query(Room).filter(Room.name == room_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Room name already exists")

    room = Room(name=room_data.name, created_by=current_user.id)
    db.add(room)
    db.commit()
    db.refresh(room)

    membership = RoomMember(user_id=current_user.id, room_id=room.id)
    db.add(membership)
    db.commit()

    return room


@router.get("/", response_model=list[RoomResponse])
def list_rooms(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Room).all()


@router.post("/{room_id}/join")
def join_room(room_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    existing_membership = db.query(RoomMember).filter(
        RoomMember.user_id == current_user.id,
        RoomMember.room_id == room_id
    ).first()

    if existing_membership:
        return {"message": "Already joined"}

    membership = RoomMember(user_id=current_user.id, room_id=room_id)
    db.add(membership)
    db.commit()

    return {"message": "Joined room successfully"}


@router.get("/{room_id}/messages", response_model=list[MessageResponse])
def get_room_messages(room_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    membership = db.query(RoomMember).filter(
        RoomMember.user_id == current_user.id,
        RoomMember.room_id == room_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this room")

    messages = db.query(Message).filter(Message.room_id == room_id).order_by(Message.timestamp.asc()).all()
    return messages