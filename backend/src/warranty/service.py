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

from exceptions import MasterNotFound
from master.models import Master
from master.service import MasterService
from warranty.models import Warranty

from utils.date_utils import format_date_ddmmyyyy, parse_date
from utils.file_utils import safe_join, split_text_to_lines

master_service = MasterService()

class WarrantyService:

    # async def create_warranty(
    #     self, session: AsyncSession, warranty: WarrantyCreate, token: dict
    # ):
    #     for _ in range(3):  # Retry up to 3 times in case of IntegrityError
    #         master = await master_service.get_master_by_name(warranty.name, session)
    #         warranty_data_dict = warranty.model_dump()
    #         warranty_data_dict["rcode"] = await self.warranty_next_code(session)
    #         warranty_data_dict["created_by"] = token["user"]["username"]
    #         warranty_data_dict["code"] = master.code
    #         # Convert date fields to date objects
    #         for date_field in ["rdate"]:
    #             if date_field in warranty_data_dict:
    #                 warranty_data_dict[date_field] = parse_date(
    #                     warranty_data_dict[date_field]
    #                 )
    #         warranty_data_dict.pop("name", None)
    #         new_warranty = Warranty(**warranty_data_dict)
    #         session.add(new_warranty)
    #         try:
    #             await session.commit()
    #             return new_warranty
    #         except IntegrityError as e:
    #             await session.rollback()

    async def warranty_next_code(self, session: AsyncSession):
        statement = select(Warranty.srf_number).order_by(Warranty.srf_number.desc()).limit(1)
        result = await session.execute(statement)
        last_srf_number = result.scalar()
        last_number = last_srf_number[1:] if last_srf_number else "0"
        next_srf_number = int(last_number) + 1
        next_srf_number = "X" + str(next_srf_number).zfill(5)
        return next_srf_number
    # cursor.execute("SELECT MAX(srf_number) FROM warranty;")
#         last_code = cursor.fetchone()[0]

#         if last_code:
#             base, _, _ = last_code.partition("/")
#             next_base_num = int(base[1:]) + 1
#         else:
#             next_base_num = 1

#         next_code = f"R{str(next_base_num).zfill(5)}/1"

    # async def list_warranty_not_received(self, session: AsyncSession):
    #     statement = (
    #         select(Warranty, Master)
    #         .join(Master, Warranty.code == Master.code)
    #         .where(Warranty.received == "N")
    #         .order_by(Warranty.rcode)
    #     )
    #     result = await session.execute(statement)
    #     rows = result.all()
    #     return [
    #         WarrantyNotReceivedResponse(
    #             rcode=row.Warranty.rcode,
    #             name=row.Master.name,
    #             contact=row.Master.contact1,
    #             details=row.Warranty.details,
    #             amount=row.Warranty.amount,
    #             received=row.Warranty.received,
    #         )
    #         for row in rows
    #     ]

    # async def update_received(
    #     self,
    #     list_warranty: List[UpdateWarrantyReceived],
    #     session: AsyncSession,
    #     token: dict,
    # ):
    #     for warranty in list_warranty:
    #         statement = select(Warranty).where(Warranty.rcode == warranty.rcode)
    #         result = await session.execute(statement)
    #         existing_warranty = result.scalar_one_or_none()
    #         if existing_warranty:
    #             existing_warranty.received = warranty.received
    #             existing_warranty.updated_by = token["user"]["username"]
    #     await session.commit()

    # async def list_warranty_unsettled(self, session: AsyncSession):
    #     statement = (
    #         select(Warranty, Master)
    #         .join(Master, Warranty.code == Master.code)
    #         .where(Warranty.settlement_date == None)
    #         .order_by(Warranty.rcode)
    #     )
    #     result = await session.execute(statement)
    #     rows = result.all()
    #     return [
    #         WarrantyUnsettledResponse(
    #             rcode=row.Warranty.rcode,
    #             name=row.Master.name,
    #             details=row.Warranty.details,
    #             amount=row.Warranty.amount,
    #             received=row.Warranty.received,
    #         )
    #         for row in rows
    #     ]

    # async def update_unsettled(
    #     self, list_warranty: List[UpdateWarrantyUnsettled], session: AsyncSession
    # ):
    #     for warranty in list_warranty:
    #         statement = select(Warranty).where(Warranty.rcode == warranty.rcode)
    #         result = await session.execute(statement)
    #         existing_warranty = result.scalar_one_or_none()
    #         if existing_warranty:
    #             existing_warranty.received = warranty.received
    #             existing_warranty.settlement_date = warranty.settlement_date
    #     await session.commit()

    # async def list_warranty_final_settlement(self, session: AsyncSession):
    #     statement = (
    #         select(Warranty, Master)
    #         .join(Master, Warranty.code == Master.code)
    #         .where((Warranty.settlement_date != None) & (Warranty.final_status == "N"))
    #         .order_by(Warranty.rcode)
    #     )
    #     result = await session.execute(statement)
    #     rows = result.all()
    #     return [
    #         WarrantyFinalSettlementResponse(
    #             rcode=row.Warranty.rcode,
    #             name=row.Master.name,
    #             rdate=format_date_ddmmyyyy(row.Warranty.rdate),
    #             details=row.Warranty.details,
    #             amount=row.Warranty.amount,
    #         )
    #         for row in rows
    #     ]

    # async def update_final_settlement(
    #     self, list_warranty: List[UpdateWarrantyFinalSettlement], session: AsyncSession
    # ):
    #     for warranty in list_warranty:
    #         statement = select(Warranty).where(Warranty.rcode == warranty.rcode)
    #         result = await session.execute(statement)
    #         existing_warranty = result.scalar_one_or_none()
    #         if existing_warranty:
    #             existing_warranty.amount = warranty.amount
    #             existing_warranty.final_status = warranty.final_status
    #     await session.commit()

    # async def get_warranty_enquiry(
    #     self,
    #     session: AsyncSession,
    #     name: Optional[str] = None,
    #     division: Optional[str] = None,
    #     from_rdate: Optional[date] = None,
    #     to_rdate: Optional[date] = None,
    #     received: Optional[str] = None,
    #     final_status: Optional[str] = None,
    # ) -> List[WarrantyEnquiry]:
    #     # Check if master name exists
    #     statement = select(Warranty, Master.name).join(Master, Master.code == Warranty.code)

    #     # Apply filters dynamically
    #     if final_status:
    #         statement = statement.where(Warranty.final_status == final_status)

    #     if name:
    #         statement = statement.where(Master.name.ilike(f"%{name}%"))

    #     if division:
    #         statement = statement.where(Warranty.division == division)

    #     if from_rdate:
    #         statement = statement.where(Warranty.rdate >= from_rdate)
    #     if to_rdate:
    #         statement = statement.where(Warranty.rdate <= to_rdate)

    #     if received:
    #         statement = statement.where(Warranty.received == received)

    #     statement = statement.order_by(Warranty.rcode)

    #     result = await session.execute(statement)
    #     rows = result.all()
    #     return [
    #         WarrantyEnquiry(
    #             rcode=row.Warranty.rcode,
    #             name=row.name,
    #             rdate=format_date_ddmmyyyy(row.Warranty.rdate),
    #             division=row.Warranty.division,
    #             details=row.Warranty.details,
    #             amount=row.Warranty.amount,
    #             received=row.Warranty.received,
    #             final_status=row.Warranty.final_status,
    #         )
    #         for row in rows
    #     ]

    # async def get_warranty_print_details(
    #     self,
    #     session: AsyncSession,
    #     name: str,
    # ) -> List[WarrantyPrintResponse]:
    #     master_exists = await master_service.check_master_name_available(name, session)
    #     if not master_exists:
    #         raise MasterNotFound()
    #     one_month_ago = date.today() - timedelta(days=30)
    #     statement = (
    #         select(Warranty)
    #         .join(Master, Master.code == Warranty.code)
    #         .where(
    #             (Master.name == name)
    #             & (Warranty.final_status != "Y")
    #         )
    #         .order_by(Warranty.rcode)
    #     )

    #     result = await session.execute(statement)
    #     rows = result.scalars().all()
    #     return [
    #         WarrantyPrintResponse(
    #             rcode=row.rcode,
    #             rdate=format_date_ddmmyyyy(row.rdate),
    #             details=row.details,
    #             amount=row.amount,
    #         )
    #         for row in rows
    #     ]

    # async def print_warranty(
    #     self, codes: WarrantyRcode, session: AsyncSession
    # ) -> io.BytesIO:
    #     """
    #     Generates a PDF warranty estimate for the given warranty codes.
    #     """
    #     # Query warranty and master info for all codes
    #     statement = (
    #         select(Warranty, Master)
    #         .join(Master, Warranty.code == Master.code)
    #         .where(Warranty.rcode.in_(codes.rcode))
    #         .order_by(Warranty.rcode)
    #     )
    #     result = await session.execute(statement)
    #     rows = result.all()

    #     # Extract header info from first row
    #     first_row = rows[0]
    #     master = first_row.Master
    #     code = master.code
    #     master_details = await master_service.get_master_details(code, session)
    #     name = master_details["name"]
    #     address = master_details["full_address"]
    #     contact = master_details["contact1"]

    #     # Prepare warranty rows for table
    #     warranty_rows = []
    #     grand_total = 0.0
    #     for row in rows:
    #         warranty = row.Warranty
    #         rcode = warranty.rcode or ""
    #         division = warranty.division or ""
    #         details = warranty.details or ""
    #         amount = float(warranty.amount) if warranty.amount else 0.0
    #         rdate = format_date_ddmmyyyy(warranty.rdate) if warranty.rdate else ""
    #         warranty_rows.append([rcode, rdate, division, details, f"{amount:.2f}"])
    #         grand_total += amount
    #     grand_total_str = f"{grand_total:.2f}"

    #     def generate_overlay(rows, name, address, contact, code, grand_total):
    #         packet = io.BytesIO()
    #         can = canvas.Canvas(packet, pagesize=A4)
    #         width, height = A4
    #         # Header
    #         can.setFont("Helvetica-Bold", 10)
    #         can.drawString(262, 675, name)
    #         can.drawString(262, 640, address)
    #         can.drawString(405, 608, contact)
    #         can.drawString(190, 608, code)

    #         text = str(grand_total)
    #         column_width = 55
    #         x_start = 500
    #         text_width = stringWidth(text, "Helvetica-Bold", 10)
    #         x_position = x_start + (column_width - text_width) / 2
    #         can.drawString(x_position, 397, text)

    #         # Table
    #         y = 562
    #         line_spacing = 8
    #         min_row_height = 20
    #         row_padding = 0.2
    #         columns = [
    #             {"x": 50, "width": 60},  # Warranty Code
    #             {"x": 120, "width": 55},  # Warranty Date
    #             {"x": 180, "width": 70},  # Division
    #             {"x": 260, "width": 235},  # Details
    #             {"x": 500, "width": 55},  # Total Amount
    #         ]
    #         can.setFont("Helvetica", 9)
    #         for idx, row in enumerate(rows, 1):
    #             row_data = row
    #             row_lines = []
    #             for col, text in zip(columns, row_data):
    #                 words = text.split()
    #                 lines = []
    #                 line = ""
    #                 for word in words:
    #                     test_line = line + (" " if line else "") + word
    #                     if stringWidth(test_line, "Helvetica", 9) <= col["width"]:
    #                         line = test_line
    #                     else:
    #                         lines.append(line)
    #                         line = word
    #                 if line:
    #                     lines.append(line)
    #                 row_lines.append(lines)
    #             max_lines = max(len(lines) for lines in row_lines)
    #             row_height = max(max_lines * line_spacing, min_row_height)
    #             for col, lines in zip(columns, row_lines):
    #                 total_text_height = len(lines) * line_spacing
    #                 vertical_offset = (row_height - total_text_height) / 2
    #                 for i, ln in enumerate(lines):
    #                     text_width = stringWidth(ln, "Helvetica", 9)
    #                     center_x = col["x"] + col["width"] / 2 - text_width / 2
    #                     y_position = y - vertical_offset - (i * line_spacing)
    #                     can.drawString(center_x, y_position, ln)
    #             y -= row_height + row_padding
    #         can.save()
    #         packet.seek(0)
    #         return PdfReader(packet)

    #     # Path to the static PDF template (use absolute path for portability, with path injection protection)
    #     base_dir = os.path.dirname(os.path.abspath(__file__))
    #     static_dir = os.path.normpath(os.path.join(base_dir, "..", "static"))
    #     template_path = safe_join(static_dir, "warranty.pdf")
    #     try:
    #         with open(template_path, "rb") as f:
    #             template_bytes = f.read()
    #     except FileNotFoundError:
    #         raise FileNotFoundError(f"Template PDF not found at {template_path}")
    #     template_buffer = io.BytesIO(template_bytes)
    #     base_pdf = PdfReader(template_buffer)

    #     overlay = generate_overlay(
    #         warranty_rows, name, address, contact, code, grand_total_str
    #     )
    #     output = PdfWriter()
    #     # Apply overlay on each base page
    #     for i in range(len(base_pdf.pages)):
    #         page = base_pdf.pages[i]
    #         overlay_page = overlay.pages[min(i, len(overlay.pages) - 1)]
    #         page.merge_page(overlay_page)
    #         output.add_page(page)
    #     result = io.BytesIO()
    #     output.write(result)
    #     result.seek(0)
    #     return result
