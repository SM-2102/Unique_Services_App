from typing import List

from fastapi import Depends, Request
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.auth.models import User
from src.db.db import get_session

from src.db.redis import jti_in_blocklist
from src.exceptions import (
    AccessDenied,
    AccessTokenRequired,
    InvalidToken,
    RefreshTokenRequired,
)

from .service import UserService
from .utils import decode_user_token

user_service = UserService()


class TokenBearer(HTTPBearer):

    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> dict:
        creds = await super().__call__(request)
        token = creds.credentials
        token_data = decode_user_token(token)

        if not self.token_valid(token):
            raise InvalidToken()

        if await jti_in_blocklist(token_data["jti"]):
            raise InvalidToken()

        self.verify_token_data(token_data)
        return token_data

    def token_valid(self, token: str) -> bool:
        token_data = decode_user_token(token)
        return token_data is not None

    def verify_token_data(self, token_data: dict):
        raise NotImplementedError("Override this method in subclasses")


class AccessTokenBearer(TokenBearer):

    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise AccessTokenRequired()


class RefreshTokenBearer(TokenBearer):

    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise RefreshTokenRequired()


async def get_current_user(
    token_data: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    username = token_data["user"]["username"]
    return await user_service.get_user_by_username(username, session)


class RoleChecker:
    def __init__(self, allowed_roles: List[str]) -> None:
        self.allowed_roles = allowed_roles

    async def __call__(self, current_user: User = Depends(get_current_user)):
        if current_user.role in self.allowed_roles:
            return True
        raise AccessDenied()
