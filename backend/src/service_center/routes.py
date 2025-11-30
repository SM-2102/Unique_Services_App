from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.dependencies import AccessTokenBearer
from db.db import get_session

from service_center.service import ServiceCenterService

service_center_router = APIRouter()
service_center_service = ServiceCenterService()
access_token_bearer = AccessTokenBearer()



"""
List all service_center names.
"""


@service_center_router.get("/list_names", response_model=List, status_code=status.HTTP_200_OK)
async def list_service_center_names(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    asc_names = await service_center_service.list_service_center_names(session)
    return asc_names

