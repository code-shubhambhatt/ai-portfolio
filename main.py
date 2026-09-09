from fastapi import FastAPI

from routes.profile import router as profile_router
from routes.projects import router as project_router
from routes.education import router as education_router
from routes.experience import router as experience_router
from routes.skills import router as skill_router

app = FastAPI()

app.include_router(profile_router)
app.include_router(project_router)
app.include_router(education_router)
app.include_router(experience_router)
app.include_router(skill_router)

@app.get("/")
def test():
    return {"message": "Fast API server started"}
