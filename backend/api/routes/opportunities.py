from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.db import SessionLocal
from backend.models.opportunity import Opportunity
from backend.schemas.opportunity import OpportunityOut


router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[OpportunityOut])
def get_opportunities(db: Session = Depends(get_db)):

    opportunities = db.query(Opportunity).order_by(Opportunity.created_at.desc()).all()

    # Map backend field names to frontend expected fields
    return [
        OpportunityOut(
            id=o.id,
            title=o.title,
            description=o.description,
            status=o.status,
            deadline=o.deadline,
            posted_date=o.posted_date,
            source=o.source,
            type=o.type,
            link=o.link,
            created_at=o.created_at,
            updated_at=o.updated_at
        )
        for o in opportunities
    ]




