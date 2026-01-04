from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.opportunity import Opportunity
from schemas.opportunity import OpportunityOut


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

@router.get("/{opportunity_id}", response_model=OpportunityOut)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        return None

    return OpportunityOut(
        id=opportunity.id,
        title=opportunity.title,
        description=opportunity.description,
        status=opportunity.status,
        deadline=opportunity.deadline,
        posted_date=opportunity.posted_date,
        source=opportunity.source,
        type=opportunity.type,
        link=opportunity.link,
        created_at=opportunity.created_at,
        updated_at=opportunity.updated_at
    )




