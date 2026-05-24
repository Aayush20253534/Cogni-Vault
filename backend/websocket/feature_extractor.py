from fastapi import APIRouter, WebSocket, WebSocketDisconnect , Depends
from connection_manager import ConnectionManager
from auth.database import get_db
from auth import get_current_ws_user
from sqlalchemy.orm import Session

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    db: Session = Depends(get_db)
):

    current_user = await get_current_ws_user(
        websocket,
        db
    )

    if not current_user:
        return

    await websocket.accept()

    print(
        f"{current_user.username} connected"
    )

    try:

        while True:

            data = await websocket.receive_json()

            print(data)

    except WebSocketDisconnect:

        print(
            f"{current_user.username} disconnected"
        )