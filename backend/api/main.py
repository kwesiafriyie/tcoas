# backend/api/main.py
from fastapi import FastAPI
from sqlalchemy import text
from backend.database.db import engine
from backend.api.routes.opportunities import router as opportunities_router

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(title="TCOAS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health/db")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "details": str(e)}

app.include_router(opportunities_router)



