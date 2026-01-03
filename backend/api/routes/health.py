from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database.db import get_db

router = APIRouter()

@router.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {
        "database": "connected",
        "result": result
    }
