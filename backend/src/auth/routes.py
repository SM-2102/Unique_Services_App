from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth.dependencies import AccessTokenBearer, RefreshTokenBearer, RoleChecker
from src.auth.service import UserService
from src.db.db import get_session

from src.db.redis import add_jti_to_blocklist
from src.exceptions import InvalidToken, UserAlreadyExists

from .schemas import UserChangePassword, UserCreate, UserLogin, UserResponse
from .utils import create_user_token

REFRESH_TOKEN_EXPIRY_DAYS = 1

auth_router = APIRouter()
user_service = UserService()
access_token_bearer = AccessTokenBearer()
refresh_token_bearer = RefreshTokenBearer()
role_checker = Depends(RoleChecker(allowed_roles=["ADMIN"]))

"""
List all users.
"""


@auth_router.get(
    "/users", status_code=status.HTTP_200_OK, response_model=list[UserResponse]
)
async def list_users(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    users = await user_service.list_users(session)
    return users


"""
Check if user exists, create new user if not.
"""


@auth_router.post(
    "/create_user", status_code=status.HTTP_201_CREATED, 
    # dependencies=[role_checker]
)
async def create_user(
    user: UserCreate,
    session: AsyncSession = Depends(get_session),
    # _=Depends(access_token_bearer),
):
    user_exists = await user_service.user_exists(user.username, session)
    if user_exists:
        raise UserAlreadyExists()
    created_user = await user_service.create_user(session, user)
    return JSONResponse(
        content={"message": f"User {created_user.username} created successfully."}
    )


"""
Check user login credentials
"""


@auth_router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: UserLogin, session: AsyncSession = Depends(get_session)):
    valid_user = await user_service.login(user, session)
    access_token = create_user_token(
        user_data={"username": valid_user.username, "role": valid_user.role}
    )
    refresh_token = create_user_token(
        user_data={"username": valid_user.username, "role": valid_user.role},
        expiry=timedelta(days=REFRESH_TOKEN_EXPIRY_DAYS),
    )
    return JSONResponse(
        content={
            "message": f"User {valid_user.username} logged in successfully.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"username": valid_user.username, "role": valid_user.role},
        }
    )


"""
Clear the user session and csrf on logout
"""


@auth_router.get("/logout", status_code=status.HTTP_200_OK)
async def logout(token_details=Depends(access_token_bearer)):
    jti = token_details["jti"]
    await add_jti_to_blocklist(jti)
    return JSONResponse(
        content={
            "message": f"User {token_details['user']['username']} logged out successfully."
        }
    )


"""
Delete a user by username if the user isnt the current user.
"""


@auth_router.delete(
    "/delete_user/{username}",
    status_code=status.HTTP_200_OK,
    dependencies=[role_checker],
)
async def delete_user(
    username: str,
    session: AsyncSession = Depends(get_session),
    token=Depends(access_token_bearer),
):
    await user_service.delete_user(username, session, token)
    return JSONResponse(content={"message": f"User {username} deleted successfully."})


"""
Check whether password matches and change to new password.
"""


@auth_router.post("/reset_password", status_code=status.HTTP_200_OK)
async def reset_password(
    user: UserChangePassword, session: AsyncSession = Depends(get_session)
):
    user = await user_service.reset_password(user, session)
    return JSONResponse(
        content={"message": f"User {user.username} password changed successfully."}
    )


"""
For refresh token to get a new access token.
"""


@auth_router.get("/refresh_token", status_code=status.HTTP_200_OK)
async def refresh_token(token_data=Depends(refresh_token_bearer)):
    expiry_timestamp = token_data["exp"]
    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_user_token(
            user_data={
                "username": token_data["username"],
            }
        )
        return JSONResponse(
            content={
                "access_token": new_access_token,
            }
        )
    raise InvalidToken()
