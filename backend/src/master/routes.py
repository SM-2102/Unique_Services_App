from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth.dependencies import AccessTokenBearer
from src.db.db import get_session
from src.exceptions import MasterNotFound
from src.master.schemas import CreateMaster, MasterResponse, UpdateMaster
from src.master.service import MasterService

master_router = APIRouter()
master_service = MasterService()
access_token_bearer = AccessTokenBearer()

"""
Create new Master if master name is not taken.
"""


@master_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_master(
    master: CreateMaster,
    session: AsyncSession = Depends(get_session),
    token=Depends(access_token_bearer),
):
    new_master = await master_service.create_master(session, master, token)
    return JSONResponse(content={"message": f"Master Created : {new_master.name}"})


"""
Get the next available master code.
"""


@master_router.get("/next_code", status_code=status.HTTP_200_OK)
async def master_next_code(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    next_code = await master_service.master_next_code(session)
    return JSONResponse(content={"next_code": next_code})


"""
Check if master name is available.
"""


@master_router.get("/check/{name}", status_code=status.HTTP_200_OK)
async def check_master_name_available(
    name: str,
    session: AsyncSession = Depends(get_session),
    _=Depends(access_token_bearer),
):
    master_available = await master_service.check_master_name_available(name, session)
    return JSONResponse(content={"available": master_available})


"""
List all master names.
"""


@master_router.get("/names", response_model=List[str], status_code=status.HTTP_200_OK)
async def list_master_names(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    names = await master_service.list_master_names(session)
    return names


"""
Get master details by code.
"""


@master_router.get(
    "/code/{code}", response_model=MasterResponse, status_code=status.HTTP_200_OK
)
async def get_master_by_code(
    code: str,
    session: AsyncSession = Depends(get_session),
    _=Depends(access_token_bearer),
):
    master = await master_service.get_master_by_code(code, session)
    return master


"""
Get master details by name.
"""


@master_router.get(
    "/name/{name}", response_model=MasterResponse, status_code=status.HTTP_200_OK
)
async def get_master_by_name(
    name: str,
    session: AsyncSession = Depends(get_session),
    _=Depends(access_token_bearer),
):
    master = await master_service.get_master_by_name(name, session)
    return master


"""
Update master details by code if master available.
"""


@master_router.patch("/{code}", status_code=status.HTTP_202_ACCEPTED)
async def update_master(
    code: str,
    master: UpdateMaster,
    session: AsyncSession = Depends(get_session),
    token=Depends(access_token_bearer),
):
    existing_master = await master_service.get_master_by_code(code, session)
    if not existing_master:
        raise MasterNotFound()
    new_master = await master_service.update_master(code, master, session, token)
    return f"Master Updated : {new_master.name}"
