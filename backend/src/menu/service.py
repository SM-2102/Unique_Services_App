from src.master.service import MasterService
from src.retail.service import RetailService
from sqlalchemy.ext.asyncio.session import AsyncSession

master_service = MasterService()
retail_service = RetailService()

class MenuService:
    async def get_dashboard_data(self, session: AsyncSession):
        # Implement the logic to fetch and return dashboard data
        number_of_customers = await master_service.number_of_masters(session)
        dashboard_number_of_customers = (number_of_customers  // 10) * 10
        division_wise_data = await retail_service.number_of_records_per_division(session)
        settled_vs_unsettled_data = await retail_service.pie_chart_counts(session)
        dashboard_data = {
            "number_of_customers": dashboard_number_of_customers,
            "retail_dashboard": {
                "division_wise_bar_graph": division_wise_data,
                "settled_vs_unsettled_pie_chart": settled_vs_unsettled_data,
            },
            "market_dashboard": {
                "month_wise_receive_vs_delivery_bar_graph": {},
                "final_status_pie_chart": {},
            },
        }
        return dashboard_data