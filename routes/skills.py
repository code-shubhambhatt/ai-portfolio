from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.skills import Skill
from schemas.skills import SkillResponse

router = APIRouter(prefix="/api/skills", tags=["portfolio"])


@router.get("/", response_model=list[SkillResponse], status_code=status.HTTP_200_OK)
def get_skills(db: Session = Depends(get_db)):
    result = db.execute(select(Skill))
    skills = result.scalars().all()

    return skills
