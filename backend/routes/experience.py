from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.experience import Experience
from schemas.experience import ExperienceResponse

router = APIRouter(prefix="/api/experiences", tags=["portfolio"])


@router.get("/", response_model=list[ExperienceResponse], status_code=status.HTTP_200_OK)
def get_experience(db: Session = Depends(get_db)):
    result = db.execute(select(Experience))

    experience = result.scalars().all()

    return experience
