from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.dependencies import AccessTokenBearer
from db.db import get_session

from warranty.service import WarrantyService

warranty_router = APIRouter()
warranty_service = WarrantyService()
access_token_bearer = AccessTokenBearer()

# """
# Create new warranty record, after checking master name and ASC name
# """


# @warranty_router.post("/create", status_code=status.HTTP_201_CREATED)
# async def create_warranty(
#     warranty: WarrantyCreate,
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     new_warranty = await warranty_service.create_warranty(session, warranty, token)
#     return JSONResponse(content={"message": f"Warranty Created : {new_warranty.rcode}"})




"""
Get the next available warranty code.
"""


@warranty_router.get("/next_srf_number", status_code=status.HTTP_200_OK)
async def warranty_next_code(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    next_srf_number = await warranty_service.warranty_next_code(session)
    return JSONResponse(content={"next_srf_number": next_srf_number})



# """
# List all not received warranty records.
# """


# @warranty_router.get(
#     "/list_of_not_received",
#     response_model=List[WarrantyNotReceivedResponse],
#     status_code=status.HTTP_200_OK,
# )
# async def list_warranty_not_received(
#     session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
# ):
#     not_received = await warranty_service.list_warranty_not_received(session)
#     return not_received


# """
# Update warranty records - List of Records
# """


# @warranty_router.patch("/update_received", status_code=status.HTTP_202_ACCEPTED)
# async def update_received(
#     list_warranty: List[UpdateWarrantyReceived],
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     await warranty_service.update_received(list_warranty, session, token)
#     return JSONResponse(content={"message": f"Warranty Records Updated"})


# """
# List all unsettled warranty records.
# """


# @warranty_router.get(
#     "/list_of_unsettled",
#     response_model=List[WarrantyUnsettledResponse],
#     status_code=status.HTTP_200_OK,
# )
# async def list_warranty_unsettled(
#     session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
# ):
#     unsettled = await warranty_service.list_warranty_unsettled(session)
#     return unsettled


# """
# Update warranty records - List of Records
# """


# @warranty_router.patch("/update_unsettled", status_code=status.HTTP_202_ACCEPTED)
# async def update_unsettled(
#     list_warranty: List[UpdateWarrantyUnsettled],
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     await warranty_service.update_unsettled(list_warranty, session)
#     return JSONResponse(content={"message": f"Warranty Records Proposed for Settlement"})


# """
# List all final settlement records
# """


# @warranty_router.get(
#     "/list_of_final_settlement",
#     response_model=List[WarrantyFinalSettlementResponse],
#     status_code=status.HTTP_200_OK,
# )
# async def list_warranty_final_settlement(
#     session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
# ):
#     final_settlement = await warranty_service.list_warranty_final_settlement(session)
#     return final_settlement


# """
# Update final settlement records - List of Records
# """


# @warranty_router.patch("/update_final_settlement", status_code=status.HTTP_202_ACCEPTED)
# async def update_final_settlement(
#     list_warranty: List[UpdateWarrantyFinalSettlement],
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     await warranty_service.update_final_settlement(list_warranty, session)
#     return JSONResponse(content={"message": f"Warranty Records Settled"})


# """
# Filter warranty enquiry records
# """


# @warranty_router.get("/enquiry", response_model=List[WarrantyEnquiry])
# async def warranty_enquiry(
#     name: Optional[str] = None,
#     division: Optional[str] = None,
#     from_rdate: Optional[date] = None,
#     to_rdate: Optional[date] = None,
#     received: Optional[str] = None,
#     final_status: Optional[str] = None,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     try:
#         enquiry_list = await warranty_service.get_warranty_enquiry(
#             session, name, division, from_rdate, to_rdate, received, final_status
#         )
#         return enquiry_list
#     except:
#         return []


# """
# Get warranty print details by name (check if customer exists)
# """


# @warranty_router.get("/show_receipt_names", response_model=List[WarrantyPrintResponse])
# async def warranty_print(
#     name: str,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):

#     print_details = await warranty_service.get_warranty_print_details(session, name)
#     return print_details


# """
# Print warranty receipt by rcode.
# """


# @warranty_router.post("/print", status_code=status.HTTP_200_OK)
# async def print_warranty(
#     data: WarrantyRcode,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     warranty_pdf = await warranty_service.print_warranty(data, session)
#     return StreamingResponse(
#         warranty_pdf,
#         media_type="application/pdf",
#         headers={"Content-Disposition": f'attachment; filename="warranty.pdf"'},
#     )
