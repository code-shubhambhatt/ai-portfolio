from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from schemas.projects import Project_Response
from models.project import Project
from database  import get_db


router = APIRouter(
    prefix="/api",
    tags=["portfolio"]
)



@router.get("/projects", response_model= list[Project_Response])
def get_projects(db:Session=Depends(get_db)):
    result = db.execute(select(Project))
    results = result.scalars().all()
    print(results)
    return results