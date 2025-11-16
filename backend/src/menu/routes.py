import asyncio
import json
import os

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth.dependencies import AccessTokenBearer
from src.db.db import get_session
from src.menu.service import MenuService

menu_router = APIRouter()
menu_service = MenuService()
access_token_bearer = AccessTokenBearer()


"""
Returns dashboard data:
- number_of_customers,
- top_customers,
- number_of_challans,
- number_of_challan_items,
- challan_rolling_months,
- division_wise_donut_retail,
- settled_vs_unsettled_pie_chart_retail,
- status_per_division_stacked_bar_chart_market,
- division_wise_pending_completed_bar_graph_warranty,
- srf_vs_delivery_month_wise_bar_graph_warranty,
- srf_receive_vs_delivery_bar_graph_out_of_warranty,
- final_status_bar_graph_out_of_warranty.

"""
@menu_router.get("/dashboard", status_code=status.HTTP_200_OK)
async def get_dashboard_data(session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)):
    number_of_customers = await menu_service.number_of_masters(session)
    top_customers = await menu_service.top_customers(session)

    retail_division_wise_data = await menu_service.retail_number_of_records_per_division(
        session
    )
    retail_received_settled_unsettled = await menu_service.retail_pie_chart_counts(session)

    number_of_challan = await menu_service.number_of_challan(session)

    challan_number_of_items = await menu_service.challan_number_of_items(session)
    challan_rolling_months = await menu_service.challan_counts_rolling_months(
        session
    )

    market_status_per_division = await menu_service.market_status_division_wise(session)

    warranty_pending_completed_per_division = (
        await menu_service.warranty_pending_completed_per_division(session)
    )
    warranty_srf_delivery = await menu_service.warranty_srf_vs_delivery(session)
    
    ow_srf_repair_delivery = await menu_service.ow_srf_vs_repair_vs_delivery(
        session
    )
    ow_pending_completed_per_division = (
        await menu_service.ow_pending_completed_per_division(session)
    )
    dashboard_data = {
        "customer": {
            "number_of_customers": ((number_of_customers // 10) * 10),
            "top_customers": top_customers,
        },
        "challan": {
            "number_of_challans": ((number_of_challan // 10) * 10),
            "number_of_items": ((challan_number_of_items // 10) * 10),
            "challan_rolling_months": challan_rolling_months,
        },
        "retail": {
            "division_wise_donut": retail_division_wise_data,
            "settled_vs_unsettled_pie_chart": retail_received_settled_unsettled,
        },
        "market": {
            "status_per_division_stacked_bar_chart": market_status_per_division,
        },
        "warranty": {
            "division_wise_pending_completed_bar_graph": warranty_pending_completed_per_division,
            "srf_vs_delivery_month_wise_bar_graph": warranty_srf_delivery,
        },
        "out_of_warranty": {
            "srf_receive_vs_delivery_bar_graph": ow_srf_repair_delivery,
            "final_status_bar_graph": ow_pending_completed_per_division,
        },
    }
    return JSONResponse(content=dashboard_data)

