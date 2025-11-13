from datetime import date, timedelta
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
    
    async def challan_counts_rolling_months(self, session: AsyncSession):
        cutoff_date = date.today().replace(day=1) - timedelta(days=150)

        total_qty = (
            func.coalesce(Challan.qty1, 0)
            + func.coalesce(Challan.qty2, 0)
            + func.coalesce(Challan.qty3, 0)
            + func.coalesce(Challan.qty4, 0)
            + func.coalesce(Challan.qty5, 0)
            + func.coalesce(Challan.qty6, 0)
            + func.coalesce(Challan.qty7, 0)
            + func.coalesce(Challan.qty8, 0)
        )

        month_expr = func.to_char(func.date_trunc('month', Challan.challan_date), 'YYYY-MM')

        statement = (
            select(
                month_expr.label('month'),
                func.count().label('total_challans'),
                func.coalesce(func.sum(total_qty), 0).label('total_quantity')
            )
            .where(Challan.challan_date >= cutoff_date)
            .group_by(month_expr)
            .order_by(month_expr)
        )

        result = await session.execute(statement)
        rows = result.fetchall()

        return [
            {
                "month": row.month,
                "total_challans": row.total_challans,
                "total_quantity": row.total_quantity,
            }
            for row in rows
        ]
