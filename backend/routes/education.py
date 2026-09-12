from fastapi import APIRouter,Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from schemas.education import EducationResponse
from models.education import Education
from database import get_db

router = APIRouter(
    prefix="/api/education",
    tags=["portfolio"]
)

@router.get("/", response_model=list[EducationResponse], status_code=status.HTTP_200_OK )
def get_education(db: Session = Depends(get_db)):
    result = db.execute(select(Education))
    education = result.scalars().all()
    return education