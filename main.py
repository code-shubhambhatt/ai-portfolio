from fastapi import FastAPI

from schemas.profile import ProfileResponse
from schemas.projects import Project_Response

from routes.profile import router as profile_router
from routes.projects import router as project_router

app = FastAPI()

app.include_router(profile_router)
app.include_router(project_router)

@app.get("/")
def test():
    return {"message": "Fast API server started"}
