from datetime import date, timedelta

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.out_of_warranty.models import OutOfWarranty


class OutOfWarrantyService:

    pass