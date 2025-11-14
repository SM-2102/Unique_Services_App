from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.retail.models import Retail


class RetailService:

    async def number_of_records_per_division(self, session: AsyncSession):
        statement = select(Retail.division, func.count()).group_by(Retail.division)
        result = await session.execute(statement)
        rows = result.all()
        return [{"division": division, "count": count} for division, count in rows]

    async def pie_chart_counts(self, session: AsyncSession):
        statement = select(
            func.count(case((Retail.received == "N", 1))).label("not_received"),
            func.count(
                case(((Retail.received == "Y") & (Retail.settlement_date.is_(None)), 1))
            ).label("received_not_settled"),
            func.count(case((Retail.settlement_date.is_not(None), 1))).label("settled"),
        )
        result = await session.execute(statement)
        data = result.mappings().first()
        return {
            "not_received": data["not_received"],
            "received_not_settled": data["received_not_settled"],
            "settled": data["settled"],
        }
