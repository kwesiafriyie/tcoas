# TCOAS

**Technical Cooperation Opportunity Aggregation System**

This repository originally held a full stack (backend, Airflow scrapers,
web frontend, mobile app) for aggregating funding and technical
cooperation opportunities. The product has since evolved into two
separate repositories that share one backend as their common source of
truth:

```
                    rfp-opportunities
                         Backend
                           │
             ┌─────────────┴─────────────┐
             │                           │
        Web application             Mobile application
     (rfp-opportunities repo)         (this repo, mobile/)
```

- **`rfp-opportunities`** (separate repository) is the current product:
  its backend (FastAPI + Postgres, 10+ live scrapers, a normalized
  opportunity model) is what both the web frontend and this repo's mobile
  app consume.
- **This repository's `backend/` and `airflow/`** are the original,
  earlier backend and scraper implementation. They are **legacy/historical**
  -- superseded by `rfp-opportunities`'s backend, not actively developed,
  and nothing in `mobile/` depends on them anymore. Kept for reference
  rather than deleted outright.
- **`mobile/`** is the actively developed part of this repository: an
  Expo/React Native client, pointed at the `rfp-opportunities` backend.
  See `mobile/README.md`.

## Project structure

```
backend/    Legacy FastAPI + Postgres backend -- historical, not the
            backend mobile actually talks to (see above)
airflow/    Legacy scraper DAGs -- unimplemented (empty stub files);
            never reached production use
mobile/     Expo / React Native app -- see mobile/README.md
```

There is no `web/` directory here despite what an earlier version of this
README said -- the web frontend was extracted into the `rfp-opportunities`
repository, which is now the more mature, actively developed one.

## Setup (legacy backend, for reference only)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in a real DATABASE_URL -- never commit .env
uvicorn api.main:app --reload
```

## Setup (mobile)

See `mobile/README.md`.
