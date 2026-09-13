import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.profile import router as profile_router
from routes.projects import router as project_router
from routes.education import router as education_router
from routes.experience import router as experience_router
from routes.skills import router as skill_router

# AI related Imports
from routes.chat import router as chat_router

app = FastAPI(title="Shubham Bhatt Portfolio API")

raw_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
if raw_origins:
    allowed_origins.extend([o.strip() for o in raw_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.pages\.dev$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(profile_router)
app.include_router(project_router)
app.include_router(education_router)
app.include_router(experience_router)
app.include_router(skill_router)


# AI related routes
app.include_router(chat_router)

@app.get("/")
def test():
    return {"message": "Fast API server started"}
