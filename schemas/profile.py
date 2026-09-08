from pydantic import BaseModel, AnyUrl

class ProfileResponse(BaseModel):
    name : str
    role : str
    bio : str | None= None
    github : AnyUrl
    linkedin : AnyUrl