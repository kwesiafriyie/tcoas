# TCOAS

**Technical Cooperation Opportunity Aggregation System**

TCOAS is a system that aggregates funding and technical cooperation opportunities from multiple international sources, processes them via data pipelines, and exposes them through APIs, web, and mobile applications.

## Architecture
- Backend: FastAPI + PostgreSQL
- Data Pipelines: Apache Airflow
- Web: React / Next.js
- Mobile: React Native (Expo)

## Project Structure
- `backend/` – API and database logic
- `airflow/` – Scrapers and DAGs
- `web/` – Web frontend
- `mobile/` – Mobile app

## Setup (Backend)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
