from fastapi import FastAPI , WebSocket , WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

"""@app.get("/")
async def home():
    with open("index.html", "r") as f:
        return HTMLResponse(f.read())

"""
class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)