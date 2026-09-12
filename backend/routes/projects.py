from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from schemas.projects import Project_Response
from models.project import Project
from database  import get_db

router = APIRouter(
    prefix="/api/projects",
    tags=["portfolio"]
)

@router.get("/", response_model= list[Project_Response])
def get_projects(db:Session=Depends(get_db)):
    result = db.execute(select(Project))
    projects = result.scalars().all()
    return projects

@router.get("/{project_id}", response_model=Project_Response)
def get_project_details(project_id:int, db:Session = Depends(get_db)):
    result = db.execute(
        select(Project).where(Project.id==project_id)
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found!")
    
    return project