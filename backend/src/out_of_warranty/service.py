import io
import os
from datetime import date, timedelta
from typing import List, Optional

from PyPDF2 import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from sqlalchemy import case, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio.session import AsyncSession

# from exceptions import IncorrectCodeFormat, WarrantyNotFound
from master.models import Master
from master.service import MasterService
# from service_center.service import ServiceCenterService
# from utils.date_utils import format_date_ddmmyyyy, parse_date
# from utils.file_utils import safe_join, split_text_to_lines
from out_of_warranty.models import OutOfWarranty
from out_of_warranty.schemas import (
    # OutOfWarrantyvendorChallanDetails,
    # OutOfWarrantyvendorCreate,
    # OutOfWarrantyCreate,
    # OutOfWarrantyEnquiry,
    OutOfWarrantyPending,
    # OutOfWarrantySrfNumber,
    # OutOfWarrantyUpdate,
    # OutOfWarrantyUpdateResponse,
)

master_service = MasterService()
# service_center_service = ServiceCenterService()


class OutOfWarrantyService:

    async def get_next_base_number(self, session: AsyncSession) -> int:
        statement = select(OutOfWarranty.srf_number)
        result = await session.execute(statement)
        srf_numbers = [
            row[0]
            for row in result.fetchall()
            if row[0] and row[0].startswith("S") and "/" in row[0]
        ]
        base_numbers = []
        for srf in srf_numbers:
            base, _ = srf.split("/")
            try:
                base_num = int(base[1:])
                base_numbers.append(base_num)
            except ValueError:
                continue
        if base_numbers:
            return max(base_numbers) + 1
        else:
            return 1

#     async def create_warranty(
#         self, session: AsyncSession, OutOfWarranty: WarrantyCreate, token: dict
#     ):
#         parts = OutOfWarranty.srf_number.split("/")
#         if len(parts) != 2 or not parts[1].isdigit():
#             raise IncorrectCodeFormat()
#         sub_number = int(parts[1])
#         if sub_number < 1 or sub_number > 8:
#             raise IncorrectCodeFormat()

#         # If frontend requests a new base, generate next base number
#         base_part = parts[0]
#         if base_part == "NEW":
#             for _ in range(3):  # Retry up to 3 times
#                 next_base = await self.get_next_base_number(session)
#                 srf_number = f"R{str(next_base).zfill(5)}/1"
#                 warranty_data_dict = OutOfWarranty.model_dump()
#                 warranty_data_dict["srf_number"] = srf_number
#                 master = await master_service.get_master_by_name(OutOfWarranty.name, session)
#                 if OutOfWarranty.head == "REPLACE":
#                     await service_center_service.check_service_center_name_available(
#                         OutOfWarranty.asc_name, session
#                     )
#                 warranty_data_dict["created_by"] = token["user"]["username"]
#                 warranty_data_dict["code"] = master.code
#                 for date_field in ["srf_date"]:
#                     if date_field in warranty_data_dict:
#                         warranty_data_dict[date_field] = parse_date(
#                             warranty_data_dict[date_field]
#                         )
#                 warranty_data_dict.pop("name", None)
#                 new_warranty = OutOfWarranty(**warranty_data_dict)
#                 session.add(new_warranty)
#                 try:
#                     await session.commit()
#                     return new_warranty
#                 except IntegrityError:
#                     await session.rollback()
#         else:
#             # Use the base provided by frontend, just validate sub-number
#             warranty_data_dict = OutOfWarranty.model_dump()
#             master = await master_service.get_master_by_name(OutOfWarranty.name, session)
#             if OutOfWarranty.head == "REPLACE":
#                 await service_center_service.check_service_center_name_available(
#                     OutOfWarranty.asc_name, session
#                 )
#             warranty_data_dict["created_by"] = token["user"]["username"]
#             warranty_data_dict["code"] = master.code
#             for date_field in ["srf_date"]:
#                 if date_field in warranty_data_dict:
#                     warranty_data_dict[date_field] = parse_date(
#                         warranty_data_dict[date_field]
#                     )
#             warranty_data_dict.pop("name", None)
#             new_warranty = OutOfWarranty(**warranty_data_dict)
#             session.add(new_warranty)
#             await session.commit()
#             return new_warranty

    async def warranty_next_code(self, session: AsyncSession):
        next_base_number = await self.get_next_base_number(session)
        next_srf_number = "S" + str(next_base_number).zfill(5)
        return next_srf_number

    async def list_out_of_warranty_pending(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty, Master)
            .join(Master, OutOfWarranty.code == Master.code)
            .where(OutOfWarranty.final_status == "N")
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantyPending(
                srf_number=row.OutOfWarranty.srf_number,
                name=row.Master.name,
            )
            for row in rows
        ]

#     async def get_warranty_by_srf_number(self, srf_number: str, session: AsyncSession):
#         if len(srf_number) != 8:
#             if srf_number.__contains__("/"):
#                 srf_number = "R" + srf_number.zfill(7)
#             else:
#                 base = srf_number.split("/")[0]
#                 srf_number = "R" + base.zfill(5) + "/1"
#         print(srf_number)
#         if not srf_number.startswith("R"):
#             raise IncorrectCodeFormat()
#         statement = (
#             select(OutOfWarranty, Master.name)
#             .join(Master, OutOfWarranty.code == Master.code)
#             .where(OutOfWarranty.srf_number == srf_number)
#         )
#         result = await session.execute(statement)
#         row = result.first()
#         if row:
#             return WarrantyUpdateResponse(
#                 srf_number=row.OutOfWarranty.srf_number,
#                 name=row.name,
#                 srf_date=format_date_ddmmyyyy(row.OutOfWarranty.srf_date),
#                 model=row.OutOfWarranty.model,
#                 head=row.OutOfWarranty.head,
#                 receive_date=row.OutOfWarranty.receive_date,
#                 repair_date=row.OutOfWarranty.repair_date,
#                 delivery_date=row.OutOfWarranty.delivery_date,
#                 challan_number=row.OutOfWarranty.challan_number,
#                 challan_date=(
#                     format_date_ddmmyyyy(row.OutOfWarranty.challan_date)
#                     if row.OutOfWarranty.challan_date
#                     else None
#                 ),
#                 division=row.OutOfWarranty.division,
#                 invoice_number=row.OutOfWarranty.invoice_number,
#                 invoice_date=row.OutOfWarranty.invoice_date,
#                 delivered_by=row.OutOfWarranty.delivered_by,
#                 status=row.OutOfWarranty.status,
#                 settlement=row.OutOfWarranty.settlement,
#                 courier=row.OutOfWarranty.courier,
#                 complaint_number=row.OutOfWarranty.complaint_number,
#             )
#         else:
#             raise WarrantyNotFound()

#     async def update_warranty(
#         self,
#         srf_number: str,
#         OutOfWarranty: WarrantyUpdate,
#         session: AsyncSession,
#         token: dict,
#     ):
#         statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == srf_number)
#         result = await session.execute(statement)
#         existing_warranty = result.scalars().first()
#         if not existing_warranty:
#             raise WarrantyNotFound()
#         for var, value in vars(OutOfWarranty).items():
#             if value is not None:
#                 setattr(existing_warranty, var, value)
#         existing_warranty.updated_by = token["user"]["username"]
#         session.add(existing_warranty)
#         await session.commit()
#         await session.refresh(existing_warranty)
#         return existing_warranty


    async def last_srf_number(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty.srf_number).order_by(OutOfWarranty.srf_number.desc()).limit(1)
        )
        result = await session.execute(statement)
        last_srf_number = result.scalar()
        last_srf_number = last_srf_number.split("/")[0] if last_srf_number else None
        return last_srf_number

#     async def print_srf(
#         self, srf_number: WarrantySrfNumber, token: dict, session: AsyncSession
#     ) -> io.BytesIO:
#         """
#         Generates a PDF for the given SRF number.
#         """
#         # Query OutOfWarranty and master data
#         statement = (
#             select(OutOfWarranty, Master)
#             .join(Master, OutOfWarranty.code == Master.code)
#             .where(OutOfWarranty.srf_number.like(f"{srf_number}/%"))
#         )
#         result = await session.execute(statement)
#         rows = result.fetchall()

#         if not rows:
#             raise WarrantyNotFound()

#         # Extract fields for overlay
#         srf_row = rows[0]
#         OutOfWarranty = srf_row.OutOfWarranty
#         master = srf_row.Master

#         srf_no = OutOfWarranty.srf_number[:6]
#         srf_date = OutOfWarranty.srf_date.strftime("%d-%m-%Y") if OutOfWarranty.srf_date else ""
#         code = OutOfWarranty.code
#         master_code = master.code
#         master_details = await master_service.get_master_details(master_code, session)
#         name = master_details["name"]
#         address = master_details["full_address"]
#         contact1 = master_details["contact1"]
#         gst = master_details["gst"] or ""
#         received_by = token["user"]["username"]

#         # Prepare table rows for overlay
#         table_rows = []
#         for row in rows:
#             w = row.OutOfWarranty
#             table_rows.append(
#                 [
#                     w.division or "",
#                     w.model or "",
#                     str(w.serial_number or ""),
#                     w.complaint_number or "",
#                     w.sticker_number or "",
#                 ]
#             )

#         def generate_overlay(
#             rows, srf_no, srf_date, code, name, address, contact1, gst, received_by
#         ):
#             packet = io.BytesIO()
#             can = canvas.Canvas(packet, pagesize=A4)
#             width, height = A4

#             can.setFont("Helvetica-Bold", 10)
#             can.drawString(140, 690, srf_no)
#             can.drawString(485, 690, srf_date)
#             can.drawString(375, 690, code)
#             can.drawString(220, 651, name)
#             can.drawString(220, 626, address)
#             can.drawString(220, 601, contact1)
#             can.drawString(475, 601, gst)
#             can.drawString(375, 187, received_by)

#             start_y = 541
#             y = start_y
#             line_spacing = 10
#             min_row_height = 20
#             row_padding = 6
#             columns = [
#                 {"x": 40, "width": 20},
#                 {"x": 70, "width": 50},
#                 {"x": 135, "width": 124},
#                 {"x": 263, "width": 97},
#                 {"x": 365, "width": 105},
#                 {"x": 472, "width": 98},
#             ]

#             can.setFont("Helvetica", 9)

#             for idx, row in enumerate(rows, 1):
#                 row_data = [str(idx)] + row
#                 row_lines = []
#                 for col, text in zip(columns, row_data):
#                     words = text.split()
#                     lines = []
#                     line = ""
#                     for word in words:
#                         test_line = line + (" " if line else "") + word
#                         if stringWidth(test_line, "Helvetica", 9) <= col["width"]:
#                             line = test_line
#                         else:
#                             lines.append(line)
#                             line = word
#                     if line:
#                         lines.append(line)
#                     row_lines.append(lines)

#                 max_lines = max(len(lines) for lines in row_lines)
#                 row_height = max(max_lines * line_spacing, min_row_height)

#                 if y - row_height < 100:
#                     can.showPage()
#                     can.setFont("Helvetica", 9)
#                     y = height - 50

#                 for col, lines in zip(columns, row_lines):
#                     total_text_height = len(lines) * line_spacing
#                     vertical_offset = (row_height - total_text_height) / 2

#                     for i, ln in enumerate(lines):
#                         text_width = stringWidth(ln, "Helvetica", 9)
#                         center_x = col["x"] + col["width"] / 2 - text_width / 2
#                         y_position = y - vertical_offset - (i * line_spacing)
#                         can.drawString(center_x, y_position, ln)

#                 y -= row_height + row_padding

#             can.save()
#             packet.seek(0)
#             return PdfReader(packet)

#         # Create overlays
#         overlay_customer = generate_overlay(
#             table_rows,
#             srf_no,
#             srf_date,
#             code,
#             name,
#             address,
#             contact1,
#             gst,
#             received_by,
#         )
#         overlay_asc = generate_overlay(
#             table_rows,
#             srf_no,
#             srf_date,
#             code,
#             name,
#             address,
#             contact1,
#             gst,
#             received_by,
#         )

#         # Path to the static PDF template (use absolute path for portability, with path injection protection)
#         base_dir = os.path.dirname(os.path.abspath(__file__))
#         static_dir = os.path.normpath(os.path.join(base_dir, "..", "static"))
#         template_path = safe_join(static_dir, "warranty_receipt.pdf")

#         # Read the template PDF
#         try:
#             with open(template_path, "rb") as f:
#                 template_bytes = f.read()
#         except FileNotFoundError:
#             raise FileNotFoundError(f"Template PDF not found at {template_path}")
#         template_buffer = io.BytesIO(template_bytes)
#         template_pdf = PdfReader(template_buffer)

#         # Merge overlays
#         writer = PdfWriter()
#         page1 = template_pdf.pages[0]
#         page1.merge_page(overlay_customer.pages[0])
#         writer.add_page(page1)

#         if len(template_pdf.pages) > 1:
#             page2 = template_pdf.pages[1]
#             page2.merge_page(overlay_asc.pages[0])
#             writer.add_page(page2)

#         output_stream = io.BytesIO()
#         writer.write(output_stream)
#         output_stream.seek(0)
#         return output_stream

    async def next_vendor_challan_code(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty.challan_number)
            .where(OutOfWarranty.challan_number.isnot(None))
            .order_by(OutOfWarranty.challan_number.desc())
            .limit(1)
        )
        result = await session.execute(statement)
        last_challan_number = result.scalar()
        last_number = last_challan_number[1:] if last_challan_number else "0"
        next_challan_number = int(last_number) + 1
        next_challan_number = "V" + str(next_challan_number).zfill(5)
        return next_challan_number


#     async def enquiry_warranty(
#         self,
#         session: AsyncSession,
#         final_status: Optional[str] = None,
#         name: Optional[str] = None,
#         division: Optional[str] = None,
#         from_srf_date: Optional[date] = None,
#         to_srf_date: Optional[date] = None,
#         delivered_by: Optional[str] = None,
#         delivered: Optional[str] = None,
#         received: Optional[str] = None,
#         repaired: Optional[str] = None,
#         head: Optional[str] = None,
#     ):

#         statement = select(OutOfWarranty, Master).join(Master, OutOfWarranty.code == Master.code)

#         if final_status:
#             statement = statement.where(OutOfWarranty.settlement == final_status)

#         if name:
#             statement = statement.where(Master.name.ilike(f"%{name}%"))

#         if division:
#             statement = statement.where(OutOfWarranty.division == division)

#         if from_srf_date:
#             statement = statement.where(OutOfWarranty.srf_date >= from_srf_date)

#         if to_srf_date:
#             statement = statement.where(OutOfWarranty.srf_date <= to_srf_date)
#         if delivered_by:
#             statement = statement.where(
#                 OutOfWarranty.delivered_by.ilike(f"%{delivered_by}%")
#             )
#         if delivered:
#             if delivered == "Y":
#                 statement = statement.where(OutOfWarranty.delivery_date.isnot(None))
#             else:
#                 statement = statement.where(OutOfWarranty.delivery_date.is_(None))
#         if received:
#             if received == "Y":
#                 print("checking received Y")
#                 statement = statement.where(
#                     OutOfWarranty.receive_date.isnot(None) & (OutOfWarranty.head == "REPLACE")
#                 )
#             else:
#                 statement = statement.where(
#                     OutOfWarranty.receive_date.is_(None) & (OutOfWarranty.head == "REPLACE")
#                 )

#         if repaired:
#             if repaired == "Y":
#                 statement = statement.where(OutOfWarranty.repair_date.isnot(None) & (OutOfWarranty.head == "REPAIR"))
#             else:
#                 statement = statement.where(OutOfWarranty.repair_date.is_(None) & (OutOfWarranty.head == "REPAIR"))
#         if head:
#             statement = statement.where(OutOfWarranty.head == head)
#         statement = statement.order_by(OutOfWarranty.srf_number)

#         result = await session.execute(statement)
#         rows = result.all()

#         return [
#             WarrantyEnquiry(
#                 srf_number=row.OutOfWarranty.srf_number,
#                 srf_date=format_date_ddmmyyyy(row.OutOfWarranty.srf_date),
#                 name=row.Master.name,
#                 model=row.OutOfWarranty.model,
#                 receive_date=(
#                     format_date_ddmmyyyy(row.OutOfWarranty.receive_date)
#                     if row.OutOfWarranty.receive_date
#                     else ""
#                 ),
#                 repair_date=(
#                     format_date_ddmmyyyy(row.OutOfWarranty.repair_date)
#                     if row.OutOfWarranty.repair_date
#                     else ""
#                 ),
#                 delivery_date=(
#                     format_date_ddmmyyyy(row.OutOfWarranty.delivery_date)
#                     if row.OutOfWarranty.delivery_date
#                     else ""
#                 ),
#                 settlement=row.OutOfWarranty.settlement,
#                 head=row.OutOfWarranty.head,
#                 contact_number=row.Master.contact1,
#             )
#             for row in rows
#         ]
