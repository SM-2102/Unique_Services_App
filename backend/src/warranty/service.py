from datetime import date, timedelta

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.warranty.models import Warranty


class WarrantyService:

    async def pending_completed_per_division(self, session: AsyncSession):
        statement = select(
            Warranty.division, Warranty.settlement, func.count().label("count")
        ).group_by(Warranty.division, Warranty.settlement)
        result = await session.execute(statement)
        rows = result.all()
        return [
            {"division": division, "settlement": settlement, "count": count}
            for division, settlement, count in rows
        ]

    async def srf_vs_delivery(self, session: AsyncSession):
        today = date.today()
        sixty_days_ago = today - timedelta(days=60)

        statement = (
            select(
                Warranty.srf_number,
                Warranty.srf_date,
                Warranty.delivery_date,
            )
            .where(
                Warranty.srf_date.isnot(None),
                Warranty.delivery_date.isnot(None),
                Warranty.srf_date >= sixty_days_ago,
            )
            .order_by(Warranty.srf_date)
            .limit(25)
        )

        result = await session.execute(statement)
        rows = result.all()

        data = [
            {
                "srf_number": r.srf_number,
                "srf_date": r.srf_date.isoformat(),
                "delivery_date": r.delivery_date.isoformat(),
            }
            for r in rows
        ]
        return data
