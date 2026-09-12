from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.profile import Profile
from schemas.profile import ProfileResponse

router = APIRouter(prefix="/api/profile", tags=["portfolio"])


@router.get("/", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def get_profile(db: Session = Depends(get_db)):
    result = db.execute(select(Profile))
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    return profile
