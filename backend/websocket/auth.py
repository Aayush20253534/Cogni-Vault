# websocket_auth.py

from fastapi import WebSocket, WebSocketException, status
from jose import JWTError
from sqlalchemy.orm import Session

from auth.JWT import decode_token
from auth.models import User


async def get_current_ws_user(
    websocket: WebSocket,
    db: Session
) -> User:
    """
    Authenticate WebSocket user using JWT token
    passed as query parameter.

    Example:
    ws://localhost:8000/ws?token=<jwt_token>
    """

    # Get token from query params
    token = websocket.query_params.get("token")

    if not token:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Token missing"
        )

    try:
        payload = decode_token(token)

        # Verify token type
        if payload.get("type") != "access":
            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="Invalid token type"
            )

        username = payload.get("sub")

        if not username:
            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="Username missing in token"
            )

    except JWTError:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Invalid or expired token"
        )

    # Fetch user
    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="User not found"
        )

    if not user.is_active:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="User account inactive"
        )

    return user