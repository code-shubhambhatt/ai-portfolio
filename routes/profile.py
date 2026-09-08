from fastapi import APIRouter
from schemas.profile import ProfileResponse

profile_info = {
    "name": "Shubham Bhatt",
    "role": "Python Developer", 
    "bio" : "fdlasjflsadjl sdfjsadljfjfl",
    "github": "https://github.com/code-shubhambhatt",
    "linkedin" : "https://www.linkedin.com/in/codingshubham/"   
}

router = APIRouter(
    prefix="/api",
    tags=["portfolio"]
)

@router.get("/profile", response_model= ProfileResponse)
def get_profile():
    return profile_info