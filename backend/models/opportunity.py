# from sqlalchemy import Column, Integer, String, Text, DateTime
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

# class Opportunity(Base):
#     __tablename__ = "opportunities"

#     opportunity_id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     description = Column(Text)
#     status = Column(String, nullable=False)
#     created_at = Column(DateTime)
#     updated_at = Column(DateTime)






from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)       # renamed from 'name'
    description = Column(Text)
    status = Column(String, nullable=False)
    deadline = Column(DateTime)
    posted_date = Column(DateTime)
    source = Column(String)
    type = Column(String)
    link = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
