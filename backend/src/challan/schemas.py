from datetime import date
from typing import Optional

from pydantic import BaseModel, Field

class CreateChallan(BaseModel):
    name: str = Field(..., min_length=3, max_length=40)
    challan_date: date
    desc1: str = Field(..., max_length=30)
    qty1: int
    unit1: str = Field(..., max_length=8)
    desc2: Optional[str] = Field(None, max_length=30)
    qty2: Optional[int] = None
    unit2: Optional[str] = Field(None, max_length=8)
    desc3: Optional[str] = Field(None, max_length=30)
    qty3: Optional[int] = None
    unit3: Optional[str] = Field(None, max_length=8)
    desc4: Optional[str] = Field(None, max_length=30)
    qty4: Optional[int] = None
    unit4: Optional[str] = Field(None, max_length=8)
    desc5: Optional[str] = Field(None, max_length=30)
    qty5: Optional[int] = None
    unit5: Optional[str] = Field(None, max_length=8)
    desc6: Optional[str] = Field(None, max_length=30)
    qty6: Optional[int] = None
    unit6: Optional[str] = Field(None, max_length=8)
    desc7: Optional[str] = Field(None, max_length=30)
    qty7: Optional[int] = None
    unit7: Optional[str] = Field(None, max_length=8)
    desc8: Optional[str] = Field(None, max_length=30)
    qty8: Optional[int] = None
    unit8: Optional[str] = Field(None, max_length=8)
    order_number: Optional[str] = Field(None, max_length=15)
    order_date: Optional[date] = None
    invoice_number: Optional[str] = Field(None, max_length=15)
    invoice_date: Optional[date] = None
    remark: str = Field(..., min_length=1, max_length=50)

class ChallanNextCodeMaxChallanDate(BaseModel):
    challan_number: str
    challan_date: date

class ChallanNumber(BaseModel):
    challan_number: str

class ChallanPrintRequest(BaseModel):
    challan_number: str

   

