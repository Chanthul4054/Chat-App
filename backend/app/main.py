from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import auth_routes, room_routes, ws_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Real-Time Chat Application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(room_routes.router)
app.include_router(ws_routes.router)


@app.get("/")
def root():
    return {"message": "Chat app backend is running"}