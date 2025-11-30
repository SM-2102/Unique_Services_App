from sqlalchemy import func, select, union_all
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio.session import AsyncSession

from exceptions import (
    ServiceCenterNotFound,
)

from .models import Service_Centre

class ServiceCenterService:

    async def check_service_center_name_available(
        self, name: str, session: AsyncSession
    ):
        statement = select(Service_Centre).where(Service_Centre.asc_name == name)
        result = await session.execute(statement)
        existing_name = result.scalar()
        if existing_name:
            return existing_name
        raise ServiceCenterNotFound()

    async def list_service_center_names(self, session: AsyncSession):
        statement = select(Service_Centre.asc_name).order_by(Service_Centre.asc_name)
        result = await session.execute(statement)
        names = result.scalars().all()
        return names

   