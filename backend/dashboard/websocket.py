import json
import logging
import uuid

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError
from starlette.websockets import WebSocketState

from app.core.database import AsyncSessionLocal
from app.core.ws_manager import manager
from app.schemas.transaction import TransactionCreate, WebSocketIngestPayload
from app.services.transaction_service import process_transaction

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/dashboard")
async def websocket_dashboard(websocket: WebSocket) -> None:
    """
    Dual-role WebSocket endpoint:
      • Registers the client so it receives all future transaction_update broadcasts.
      • Optionally accepts inbound JSON payloads to ingest new transactions in real time.

    Gracefully handles:
      - Abrupt client disconnects (WebSocketDisconnect)
      - Malformed JSON
      - Pydantic validation errors
      - Database / pipeline errors (isolated per message — never kills the socket)
    """
    client_id: str = str(uuid.uuid4())
    await manager.connect(client_id=client_id, websocket=websocket)

    try:
        await websocket.send_json(
            {
                "event": "connection_established",
                "client_id": client_id,
                "message": "Connected to Cogni-Vault real-time transaction stream.",
            }
        )

        while True:
            # Guard: stop polling if the socket has closed underneath us
            if websocket.client_state != WebSocketState.CONNECTED:
                break

            raw_text: str = await websocket.receive_text()

            # ── Parse JSON ────────────────────────────────────────────────────
            try:
                raw_json: dict = json.loads(raw_text)
            except json.JSONDecodeError:
                await _safe_send_json(
                    websocket,
                    {"event": "error", "detail": "Payload is not valid JSON."},
                )
                continue

            # ── Validate payload ──────────────────────────────────────────────
            try:
                ingest: WebSocketIngestPayload = WebSocketIngestPayload.model_validate(
                    raw_json
                )
            except ValidationError as exc:
                await _safe_send_json(
                    websocket,
                    {"event": "validation_error", "detail": exc.errors()},
                )
                continue

            # ── Process transaction ───────────────────────────────────────────
            tx_payload = TransactionCreate(
                user_id=ingest.user_id,
                sender_upi=ingest.sender_upi,
                receiver_upi=ingest.receiver_upi,
                amount=ingest.amount,
            )

            async with AsyncSessionLocal() as db:
                try:
                    await process_transaction(db=db, payload=tx_payload)
                    await db.commit()
                except Exception as exc:
                    await db.rollback()
                    logger.error(
                        "WS transaction error | client=%s error=%s",
                        client_id,
                        exc,
                        exc_info=True,
                    )
                    await _safe_send_json(
                        websocket,
                        {
                            "event": "processing_error",
                            "detail": "Transaction processing failed. Please retry.",
                        },
                    )

    except WebSocketDisconnect:
        logger.info("WebSocket graceful disconnect | client=%s", client_id)
    except Exception as exc:
        logger.error(
            "WebSocket fatal error | client=%s error=%s",
            client_id,
            exc,
            exc_info=True,
        )
    finally:
        # Always clean up regardless of how the loop exited
        await manager.disconnect(client_id=client_id)


async def _safe_send_json(websocket: WebSocket, payload: dict) -> None:
    """Send a JSON error frame without raising if the socket is already closed."""
    try:
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json(payload)
    except Exception:
        pass
