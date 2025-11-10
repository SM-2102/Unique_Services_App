# Retail Dashboard:
# Bar Graph - division wise
# Pie of settled vs unsettled

#Market Dashboard:
# Bar Graph - month wise receive vs delivery
# Pie of final_status wise

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from src.db.db import get_session
from src.auth.dependencies import AccessTokenBearer
from src.menu.service import MenuService
from sqlmodel.ext.asyncio.session import AsyncSession

menu_router = APIRouter()
menu_service = MenuService()
access_token_bearer = AccessTokenBearer()

'''
Returns dashboard data:
- number_of_customers,

'''
@menu_router.get("/dashboard", status_code=status.HTTP_200_OK)
async def get_dashboard_data(session: AsyncSession = Depends(get_session)):
    dashboard_data = await menu_service.get_dashboard_data(session)
    return JSONResponse(content=dashboard_data)
