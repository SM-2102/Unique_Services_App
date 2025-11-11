from src.challan.models import Challan
from sqlalchemy import select , func, case
from sqlalchemy.ext.asyncio.session import AsyncSession

class ChallanService:

    async def number_of_challan(self, session: AsyncSession):
        statement = select(func.count(Challan.challan_number))
        result = await session.execute(statement)
        return result.scalar()

    async def number_of_items(self, session: AsyncSession):
        statement = select(func.sum(Challan.qty1) + func.sum(Challan.qty2) + func.sum(Challan.qty3) + func.sum(Challan.qty4) + func.sum(Challan.qty5) + func.sum(Challan.qty6) + func.sum(Challan.qty7) + func.sum(Challan.qty8)).select_from(Challan)
        result = await session.execute(statement)
        return result.scalar()
   