from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field

from datetime import date
from email.policy import default

import sqlalchemy.dialects.postgresql as pg
from sqlalchemy import ForeignKey
from sqlmodel import Column, Field, SQLModel


class OutOfWarrantyCreate(BaseModel):
    srf_number: str = Field(..., max_length=8)
    name: str = Field(..., max_length=30)
    division: str = Field(..., max_length=15)
    srf_date: date
    head: Optional[str] = Field(None, max_length=20)
    model: str = Field(..., max_length=30)
    serial_number: str = Field(..., max_length=15)
    problem: Optional[str] = Field(None, max_length=30)
    remark: Optional[str] = Field(None, max_length=40)
    service_charge: int
    service_charge_waive: str = Field(..., max_length=1)
    collection_date: Optional[date]
    waive_details: Optional[str] = Field(None, max_length=40)

class OutOfWarrantyEnquiry(BaseModel):
    srf_number: str
    srf_date: str
    name: str
    model: str
    head: str
    receive_date: Optional[str]
    repair_date: Optional[str]
    delivery_date: Optional[str]
    contact_number: Optional[str]


class OutOfWarrantyPending(BaseModel):
    srf_number: str
    name: str


class OutOfWarrantySrfNumber(BaseModel):
    srf_number: str


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


class OutOfWarrantyVendorChallanDetails(BaseModel):
    srf_number: str
    division: str
    model: str
    serial_number: str
    challan: str


class OutOfWarrantyVendorChallanCreate(BaseModel):
    srf_number: str
    challan_number: str = Field(..., max_length=6)
    vendor_date1: date
    challan: str = Field(..., max_length=1)
    received_by: str = Field(..., max_length=20)


class OutOfWarrantyVendorChallanCode(BaseModel):
    challan_number: str


class OutOfWarrantyVendorNotSettledRecord(BaseModel):
    srf_number: str
    division: str
    model: str
    challan_number: Optional[str]
    amount: float
    vendor_bill_number: Optional[str]
    received_by: str

class UpdateVendorUnsettled(BaseModel):
    srf_number: str
    vendor_bill_number: str = Field(..., max_length=8)
    vendor_settlement_date: date

class OutOfWarrantyVendorFinalSettlementRecord(BaseModel):
    srf_number: str
    division: str
    model: str
    challan_number: Optional[str]
    vendor_cost1: float
    vendor_cost2: float
    vendor_bill_number: Optional[str]
    received_by: str
    amount: float

class UpdateVendorFinalSettlement(BaseModel):
    srf_number: str
    vendor_cost1:float
    vendor_cost2:float
    vendor_settled: str = Field(..., max_length=1)


class OutOfWarrantySRFSettleRecord(BaseModel):
    srf_number: str
    name: str
    model: str
    delivery_date: Optional[date]
    final_amount: Optional[float]
    received_by: Optional[str]
    pc_number: Optional[int]
    invoice_number: Optional[int]
    service_charge: Optional[float]
    waive_details: Optional[str]

class UpdateSRFUnsettled(BaseModel):
    srf_number: str
    settlement_date: date

class UpdateSRFFinalSettlement(BaseModel):
    srf_number: str
    final_settled: str = Field(..., max_length=1)

class OutOfWarrantyEnquiry(BaseModel):
    srf_number: str
    srf_date: str
    name: str
    model: str
    estimate_date: Optional[str]
    repair_date: Optional[str]
    vendor_date1: Optional[str]
    delivery_date: Optional[str]
    final_amount: Optional[float]
    contact_number: Optional[str]

