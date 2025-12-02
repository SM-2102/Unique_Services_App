from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from auth.dependencies import AccessTokenBearer
from db.db import get_session
# from exceptions import WarrantyNotFound
from out_of_warranty.schemas import (
    # OutOfWarrantyvendorChallanCode,
    # OutOfWarrantyvendorChallanDetails,
    # OutOfWarrantyvendorCreate,
    # OutOfWarrantyvendorRequest,
    # OutOfWarrantyCreate,
    # OutOfWarrantyEnquiry,
    OutOfWarrantyPending,
    # OutOfWarrantySrfNumber,
    # OutOfWarrantyUpdate,
    # OutOfWarrantyUpdateResponse,
)
from out_of_warranty.service import OutOfWarrantyService

out_of_warranty_router = APIRouter()
out_of_warranty_service = OutOfWarrantyService()
access_token_bearer = AccessTokenBearer()

# """
# Create new OutOfWarranty record, after checking master name and ASC name
# """


# @out_of_warranty_router.post("/create", status_code=status.HTTP_201_CREATED)
# async def create_warranty(
#     OutOfWarranty: WarrantyCreate,
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     new_warranty = await out_of_warranty_service.create_warranty(session, OutOfWarranty, token)
#     return JSONResponse(
#         content={
#             "srf_number": new_warranty.srf_number,
#             "message": f"SRF Number : {new_warranty.srf_number}",
#         }
#     )


"""
Get the next available OutOfWarranty code.
"""


@out_of_warranty_router.get("/next_srf_number", status_code=status.HTTP_200_OK)
async def out_of_warranty_next_code(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    out_of_warranty_base = await out_of_warranty_service.warranty_next_code(session)
    return JSONResponse(content={"next_srf_number": out_of_warranty_base})


"""
List all prending out of Out Of Warranty records.
"""


@out_of_warranty_router.get(
    "/list_pending",
    response_model=List[OutOfWarrantyPending],
    status_code=status.HTTP_200_OK,
)
async def list_out_of_warranty_pending(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    pending = await out_of_warranty_service.list_out_of_warranty_pending(session)
    return pending


# """
# Get OutOfWarranty details by srf_number.
# """


# @out_of_warranty_router.post(
#     "/by_srf_number",
#     response_model=WarrantyUpdateResponse,
#     status_code=status.HTTP_200_OK,
# )
# async def get_warranty_by_srf_number(
#     data: WarrantySrfNumber,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     OutOfWarranty = await out_of_warranty_service.get_warranty_by_srf_number(
#         data.srf_number, session
#     )
#     return OutOfWarranty


# """
# Update OutOfWarranty details by srf_number.
# """


# @out_of_warranty_router.patch(
#     "/update/{srf_number:path}", status_code=status.HTTP_202_ACCEPTED
# )
# async def update_warranty(
#     srf_number: str,
#     OutOfWarranty: WarrantyUpdate,
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     print(OutOfWarranty)
#     existing_warranty = await out_of_warranty_service.get_warranty_by_srf_number(
#         srf_number, session
#     )
#     if not existing_warranty:
#         raise WarrantyNotFound()
#     new_warranty = await out_of_warranty_service.update_warranty(
#         srf_number, OutOfWarranty, session, token
#     )
#     return JSONResponse(
#         content={"message": f"OutOfWarranty Updated : {new_warranty.srf_number}"}
#     )


"""
Get the last created srf number
"""


@out_of_warranty_router.get("/last_srf_number", status_code=status.HTTP_200_OK)
async def last_srf_number(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    last_srf_number = await out_of_warranty_service.last_srf_number(session)
    return JSONResponse(content={"last_srf_number": last_srf_number})


# """
# Print srf by srf number.
# """


# @out_of_warranty_router.post("/srf_print", status_code=status.HTTP_200_OK)
# async def print_srf(
#     data: WarrantySrfNumber,
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     srf_pdf = await out_of_warranty_service.print_srf(data.srf_number, token, session)
#     return StreamingResponse(
#         srf_pdf,
#         media_type="application/pdf",
#         headers={
#             "Content-Disposition": f'attachment; filename="{data.srf_number}.pdf"'
#         },
#     )


"""
Get the next available challan code
"""


@out_of_warranty_router.get("/next_vendor_challan_code", status_code=status.HTTP_200_OK)
async def next_vendor_challan_code(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    challan_number = await out_of_warranty_service.next_vendor_challan_code(session)
    return JSONResponse(content={"next_vendor_challan_code": challan_number})


"""
Get the last created challan code.
"""


@out_of_warranty_router.get("/last_vendor_challan_code", status_code=status.HTTP_200_OK)
async def last_vendor_challan_code(
    session: AsyncSession = Depends(get_session), _=Depends(access_token_bearer)
):
    last_challan_number = await out_of_warranty_service.last_vendor_challan_code(session)
    return JSONResponse(content={"last_vendor_challan_code": last_challan_number})


# """
# List vendor Challan Details
# """


# @out_of_warranty_router.post(
#     "/list_vendor_challan_details",
#     response_model=List[WarrantyvendorChallanDetails],
#     status_code=status.HTTP_200_OK,
# )
# async def list_vendor_challan_details(
#     data: WarrantyvendorRequest,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     vendor_list = await out_of_warranty_service.list_vendor_challan_details(session, data.division)
#     return vendor_list


# """
# Update retail records - List of Records
# """


# @out_of_warranty_router.patch("/create_vendor_challan", status_code=status.HTTP_202_ACCEPTED)
# async def create_vendor_challan(
#     list_retail: List[WarrantyvendorCreate],
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     await out_of_warranty_service.create_vendor_challan(list_retail, session)
#     return JSONResponse(content={"message": f"vendor Challan Records Updated"})


# """
# Print vendor challan by vendor number.
# """


# @out_of_warranty_router.post("/vendor_challan_print", status_code=status.HTTP_200_OK)
# async def print_vendor_challan(
#     data: WarrantyvendorChallanCode,
#     session: AsyncSession = Depends(get_session),
#     token=Depends(access_token_bearer),
# ):
#     vendor_pdf = await out_of_warranty_service.print_vendor_challan(
#         data.challan_number, token, session
#     )
#     return StreamingResponse(
#         vendor_pdf,
#         media_type="application/pdf",
#         headers={
#             "Content-Disposition": f'attachment; filename="{data.challan_number}.pdf"'
#         },
#     )


# """
# OutOfWarranty enquiry using query parameters.

#  """


# @out_of_warranty_router.get(
#     "/enquiry", response_model=List[WarrantyEnquiry], status_code=status.HTTP_200_OK
# )
# async def enquiry_warranty(
#     final_status: Optional[str] = None,
#     name: Optional[str] = None,
#     division: Optional[str] = None,
#     from_srf_date: Optional[date] = None,
#     to_srf_date: Optional[date] = None,
#     delivered_by: Optional[str] = None,
#     delivered: Optional[str] = None,
#     received: Optional[str] = None,
#     repaired: Optional[str] = None,
#     head: Optional[str] = None,
#     session: AsyncSession = Depends(get_session),
#     _=Depends(access_token_bearer),
# ):
#     try:
#         result = await out_of_warranty_service.enquiry_warranty(
#             session,
#             final_status,
#             name,
#             division,
#             from_srf_date,
#             to_srf_date,
#             delivered_by,
#             delivered,
#             received,
#             repaired,
#             head,
#         )
#         return result
#     except:
#         return []
