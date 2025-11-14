from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.market.models import Market


class MarketService:

    async def status_division_wise(self, session: AsyncSession):
        statement = select(
            Market.division, Market.final_status, func.count().label("count")
        ).group_by(Market.division, Market.final_status)
        result = await session.execute(statement)
        rows = result.all()
        return [
            {"division": division, "final_status": final_status, "count": count}
            for division, final_status, count in rows
        ]
