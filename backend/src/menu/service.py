from datetime import date, timedelta

from sqlalchemy import case, func, select, union_all
from sqlalchemy.ext.asyncio.session import AsyncSession

from challan.models import Challan
from market.models import Market
from master.models import Master
from out_of_warranty.models import OutOfWarranty
from retail.models import Retail
from warranty.models import Warranty
from service_center.models import ServiceCentre


class MenuService:

    async def number_of_masters(self, session: AsyncSession):
        statement = select(func.count(Master.code))
        result = await session.execute(statement)
        return result.scalar()
    
    async def number_of_asc_names(self, session: AsyncSession):
        statement = select(func.count(ServiceCentre.asc_name))
        result = await session.execute(statement)
        return result.scalar()

    async def top_customers(self, session: AsyncSession):
        select_statement = (
            select(Master.code),
            select(Retail.code),
            select(Challan.code),
            select(Market.code),
            select(Warranty.code),
            select(OutOfWarranty.code),
        )
        combined_cte = union_all(*select_statement).cte("combined_cte")
        statement = (
            select(Master.name, func.count().label("total_count"))
            .join(combined_cte, Master.code == combined_cte.c.code)
            .group_by(Master.name)
            .order_by(func.count().desc())
            .limit(5)
        )
        result = await session.execute(statement)
        top_customers = result.all()
        return {row.name: row.total_count for row in top_customers}

    async def retail_number_of_records_per_division(self, session: AsyncSession):
        statement = select(Retail.division, func.count()).group_by(Retail.division)
        result = await session.execute(statement)
        rows = result.all()
        return [{"division": division, "count": count} for division, count in rows]

    async def retail_pie_chart_counts(self, session: AsyncSession):
        statement = select(
            func.count(
                case(((Retail.received == "N") & (Retail.settlement_date.is_(None)), 1))
            ).label("not_received"),
            func.count(
                case(((Retail.received == "Y") & (Retail.settlement_date.is_(None)), 1))
            ).label("received_not_settled"),
            func.count(
                case(
                    (
                        (Retail.settlement_date.is_not(None))
                        & (Retail.final_status == "N"),
                        1,
                    )
                )
            ).label("propose_for_settlement"),
            func.count(case((Retail.final_status == "Y", 1))).label("settled"),
        )
        result = await session.execute(statement)
        data = result.mappings().first()
        return {
            "not_received": data["not_received"],
            "received_not_settled": data["received_not_settled"],
            "propose_for_settlement": data["propose_for_settlement"],
            "settled": data["settled"],
        }

    async def number_of_challan(self, session: AsyncSession):
        statement = select(func.count(Challan.challan_number))
        result = await session.execute(statement)
        return result.scalar()

    async def challan_number_of_items(self, session: AsyncSession):
        statement = select(
            func.coalesce(func.sum(Challan.qty1), 0)
            + func.coalesce(func.sum(Challan.qty2), 0)
            + func.coalesce(func.sum(Challan.qty3), 0)
            + func.coalesce(func.sum(Challan.qty4), 0)
            + func.coalesce(func.sum(Challan.qty5), 0)
            + func.coalesce(func.sum(Challan.qty6), 0)
            + func.coalesce(func.sum(Challan.qty7), 0)
            + func.coalesce(func.sum(Challan.qty8), 0)
        )
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

        month_expr = func.to_char(
            func.date_trunc("month", Challan.challan_date), "YYYY-MM"
        )

        statement = (
            select(
                month_expr.label("month"),
                func.count().label("total_challans"),
                func.coalesce(func.sum(total_qty), 0).label("total_quantity"),
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

    async def market_status_division_wise(self, session: AsyncSession):
        statement = select(
            Market.division, Market.final_status, func.count().label("count")
        ).group_by(Market.division, Market.final_status)
        result = await session.execute(statement)
        rows = result.all()
        return [
            {"division": division, "final_status": final_status, "count": count}
            for division, final_status, count in rows
        ]

    async def warranty_pending_completed_per_division(self, session: AsyncSession):
        statement = select(
            Warranty.division, Warranty.settlement, func.count().label("count")
        ).group_by(Warranty.division, Warranty.settlement)
        result = await session.execute(statement)
        rows = result.all()
        return [
            {"division": division, "settlement": settlement, "count": count}
            for division, settlement, count in rows
        ]

    async def warranty_srf_vs_delivery(self, session: AsyncSession):
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
                Warranty.srf_number.like("R_____/1"),
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

    async def ow_pending_completed_per_division(self, session: AsyncSession):

        # Create a dynamic CASE column for status
        status_case = case(
            (OutOfWarranty.final_status == "Y", "COMPLETED"), else_="PENDING"
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

    async def ow_srf_vs_repair_vs_delivery(self, session: AsyncSession):
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
                OutOfWarranty.srf_number.like("S_____/1"),
            )
            .order_by(OutOfWarranty.srf_number)
            .limit(25)
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
