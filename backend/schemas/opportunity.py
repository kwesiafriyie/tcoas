from pydantic import BaseModel
from datetime import datetime

# class OpportunityOut(BaseModel):
#     opportunity_id: int
#     name: str
#     description: str | None
#     status: str
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         from_attributes = True




class OpportunityOut(BaseModel):
    id: int                 # map from opportunity_id
    title: str              # map from name
    description: str | None
    status: str
    deadline: datetime
    posted_date: datetime
    source: str | None
    type: str | None
    link: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True