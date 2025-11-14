from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    password: str = Field(min_length=6)
    role: str = Field(default="USER")
    phone_number: str = Field(min_length=10, max_length=10, pattern="^[0-9]{10}$")


class UserResponse(BaseModel):
    username: str
    role: str
    phone_number: str


class UserLogin(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class UserChangePassword(BaseModel):
    username: str = Field(..., min_length=1)
    old_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)
