from sqlalchemy.ext.asyncio.session import AsyncSession

from src.challan.service import ChallanService
from src.market.service import MarketService
from src.master.service import MasterService
from src.out_of_warranty.service import OutOfWarrantyService
from src.retail.service import RetailService
from src.warranty.service import WarrantyService

master_service = MasterService()
retail_service = RetailService()
challan_service = ChallanService()
market_service = MarketService()
warranty_service = WarrantyService()
out_of_warranty_service = OutOfWarrantyService()


class MenuService:
    async def get_dashboard_data(self, session: AsyncSession):
        # Implement the logic to fetch and return dashboard data
        number_of_customers = await master_service.number_of_masters(session)
        top_customers = await master_service.top_customers(session)
        division_wise_data = await retail_service.number_of_records_per_division(
            session
        )
        received_settled_unsettled = await retail_service.pie_chart_counts(session)
        number_of_challan = await challan_service.number_of_challan(session)
        number_of_items = await challan_service.number_of_items(session)
        challan_rolling_months = await challan_service.challan_counts_rolling_months(
            session
        )
        status_per_division = await market_service.status_division_wise(session)
        pending_completed_per_division_warranty = (
            await warranty_service.pending_completed_per_division(session)
        )
        srf_delivery = await warranty_service.srf_vs_delivery(session)
        pending_completed_per_division_ow = (
            await out_of_warranty_service.pending_completed_per_division(session)
        )
        srf_repair_delivery = await out_of_warranty_service.srf_vs_repair_vs_delivery(
            session
        )
        dashboard_data = {
            "customer": {
                "number_of_customers": ((number_of_customers // 10) * 10),
                "top_customers": top_customers,
            },
            "challan": {
                "number_of_challans": ((number_of_challan // 10) * 10),
                "number_of_items": ((number_of_items // 10) * 10),
                "challan_rolling_months": challan_rolling_months,
            },
            "retail": {
                "division_wise_donut": division_wise_data,
                "settled_vs_unsettled_pie_chart": received_settled_unsettled,
            },
            "market": {
                "status_per_division_stacked_bar_chart": status_per_division,
            },
            "warranty": {
                "division_wise_pending_completed_bar_graph": pending_completed_per_division_warranty,
                "srf_vs_delivery_month_wise_bar_graph": srf_delivery,
            },
            "out_of_warranty": {
                "srf_receive_vs_delivery_bar_graph": srf_repair_delivery,
                "final_status_bar_graph": pending_completed_per_division_ow,
            },
        }
        return dashboard_data
