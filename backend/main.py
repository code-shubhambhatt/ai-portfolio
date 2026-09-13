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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
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
