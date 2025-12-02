from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


# class OutOfWarrantyCreate(BaseModel):
#     srf_number: str = Field(..., max_length=8)
#     name: str = Field(..., max_length=40)
#     srf_date: date
#     head: str = Field(..., max_length=15)
#     division: str = Field(..., max_length=15)
#     model: str = Field(..., max_length=30)
#     serial_number: str = Field(..., max_length=20)
#     problem: str = Field(..., max_length=30)
#     remark: Optional[str] = Field(None, max_length=40)
#     sticker_number: Optional[str] = Field(None, max_length=15)
#     asc_name: Optional[str] = Field(None, max_length=30)
#     complaint_number: Optional[str] = Field(None, max_length=20)


# class OutOfWarrantyEnquiry(BaseModel):
#     srf_number: str
#     srf_date: str
#     name: str
#     model: str
#     head: str
#     receive_date: Optional[str]
#     repair_date: Optional[str]
#     delivery_date: Optional[str]
#     contact_number: Optional[str]


class OutOfWarrantyPending(BaseModel):
    srf_number: str
    name: str


# class OutOfWarrantySrfNumber(BaseModel):
#     srf_number: str


# class OutOfWarrantyUpdateResponse(BaseModel):
#     srf_number: str
#     name: str
#     division: str
#     model: str
#     challan_number: Optional[str]
#     challan_date: Optional[str]
#     head: str
#     repair_date: Optional[date]
#     receive_date: Optional[date]
#     invoice_number: Optional[str]
#     invoice_date: Optional[date]
#     delivery_date: Optional[date]
#     delivered_by: Optional[str]
#     status: Optional[str]
#     settlement: str
#     srf_date: str
#     courier: Optional[str]
#     complaint_number: Optional[str]


# class OutOfWarrantyUpdate(BaseModel):
#     repair_date: Optional[date]
#     receive_date: Optional[date]
#     invoice_number: Optional[str] = Field(None, max_length=16)
#     invoice_date: Optional[date]
#     delivery_date: Optional[date]
#     delivered_by: Optional[str] = Field(None, max_length=20)
#     status: Optional[str] = Field(None, max_length=40)
#     courier: Optional[str] = Field(None, max_length=15)
#     complaint_number: Optional[str] = Field(None, max_length=20)
#     settlement: Optional[str] = Field(None, max_length=1)


# class OutOfWarrantyCNFChallanDetails(BaseModel):
#     srf_number: str
#     name: str
#     model: str
#     serial_number: str
#     challan: str


# class OutOfWarrantyCNFRequest(BaseModel):
#     division: str


# class OutOfWarrantyCNFCreate(BaseModel):
#     srf_number: str
#     challan_number: str = Field(..., max_length=6)
#     challan_date: date
#     challan: str = Field(..., max_length=1)


# class OutOfWarrantyCNFChallanCode(BaseModel):
#     challan_number: str
