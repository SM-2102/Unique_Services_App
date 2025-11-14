from datetime import date, timedelta

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.out_of_warranty.models import OutOfWarranty


class OutOfWarrantyService:

    async def pending_completed_per_division(self, session: AsyncSession):

        # Create a dynamic CASE column for status
        status_case = case(
            (OutOfWarranty.settlement_date.isnot(None), "COMPLETED"), else_="PENDING"
        ).label("status")

        statement = (
            select(OutOfWarranty.division, status_case, func.count().label("count"))
            .group_by(OutOfWarranty.division, status_case)
            .order_by(OutOfWarranty.division)
        )

        result = await session.execute(statement)
        rows = result.all()

        return [
            {"division": division, "status": status, "count": count}
            for division, status, count in rows
        ]

    async def srf_vs_repair_vs_delivery(self, session: AsyncSession):
        today = date.today()
        sixty_days_ago = today - timedelta(days=60)

        statement = (
            select(
                OutOfWarranty.srf_number,
                OutOfWarranty.srf_date,
                OutOfWarranty.repair_date,
                OutOfWarranty.delivery_date,
            )
            .where(
                OutOfWarranty.srf_date.isnot(None),
                OutOfWarranty.repair_date.isnot(None),
                OutOfWarranty.delivery_date.isnot(None),
                OutOfWarranty.srf_date >= sixty_days_ago,
            )
            .order_by(OutOfWarranty.srf_date)
        )

        result = await session.execute(statement)
        rows = result.all()

        data = [
            {
                "srf_number": r.srf_number,
                "srf_date": r.srf_date.isoformat(),
                "repair_date": r.repair_date.isoformat(),
                "delivery_date": r.delivery_date.isoformat(),
            }
            for r in rows
        ]
        return data
