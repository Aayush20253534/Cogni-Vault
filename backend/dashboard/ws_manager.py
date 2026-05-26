import asyncio
import json
import logging
from typing import Dict

from fastapi import WebSocket
from starlette.websockets import WebSocketState

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Tracks all active WebSocket connections keyed by a unique client_id string.
    All mutations are protected by an asyncio.Lock to prevent race conditions
    under concurrent coroutine execution.
    """

    def __init__(self) -> None:
        self._active_connections: Dict[str, WebSocket] = {}
        self._lock: asyncio.Lock = asyncio.Lock()

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._active_connections[client_id] = websocket
        logger.info(
            "WebSocket connected | client=%s | total_connections=%d",
            client_id,
            len(self._active_connections),
        )

    async def disconnect(self, client_id: str) -> None:
        async with self._lock:
            websocket = self._active_connections.pop(client_id, None)

        if websocket is not None:
            try:
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.close()
            except Exception:
                # Socket may already be closed; suppress silently
                pass

        logger.info(
            "WebSocket disconnected | client=%s | total_connections=%d",
            client_id,
            len(self._active_connections),
        )

    async def broadcast(self, message: dict) -> None:
        """
        Serialize `message` to JSON and push to every connected client.
        Clients that fail mid-broadcast are collected and disconnected
        without interrupting the remaining send loop.
        """
        if not self._active_connections:
            return

        payload: str = json.dumps(message, default=str)
        stale_clients: list[str] = []

        # Take a point-in-time snapshot so the lock is held as briefly as possible
        async with self._lock:
            snapshot: Dict[str, WebSocket] = dict(self._active_connections)

        for client_id, websocket in snapshot.items():
            try:
                if websocket.client_state == WebSocketState.CONNECTED:
                    await websocket.send_text(payload)
                else:
                    stale_clients.append(client_id)
            except Exception as exc:
                logger.warning(
                    "Broadcast failed | client=%s | reason=%s",
                    client_id,
                    exc,
                )
                stale_clients.append(client_id)

        for client_id in stale_clients:
            await self.disconnect(client_id)

    @property
    def active_connection_count(self) -> int:
        return len(self._active_connections)


# Module-level singleton shared across the entire application
manager: ConnectionManager = ConnectionManager()
