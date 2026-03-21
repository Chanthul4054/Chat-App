from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..auth import verify_token
from ..models import Message, RoomMember
from ..websocket_manager import manager

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, token: str = Query(...)):
    user_id = verify_token(token)
    if not user_id:
        await websocket.close(code=1008)
        return

    db: Session = SessionLocal()
    membership = db.query(RoomMember).filter(
        RoomMember.user_id == user_id,
        RoomMember.room_id == room_id
    ).first()

    if not membership:
        await websocket.close(code=1008)
        db.close()
        return

    await manager.connect(room_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()

            message = Message(
                room_id=room_id,
                sender_id=user_id,
                content=data
            )
            db.add(message)
            db.commit()
            db.refresh(message)

            await manager.broadcast(room_id, {
                "room_id": room_id,
                "sender_id": user_id,
                "content": data,
                "timestamp": str(message.timestamp)
            })

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
    finally:
        db.close()