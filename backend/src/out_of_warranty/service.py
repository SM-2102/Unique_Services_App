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

from exceptions import IncorrectCodeFormat, OutOfWarrantyNotFound
from master.models import Master
from master.service import MasterService
from utils.date_utils import format_date_ddmmyyyy, parse_date
from utils.file_utils import safe_join, split_text_to_lines
from out_of_warranty.models import OutOfWarranty
from out_of_warranty.schemas import (
    OutOfWarrantyEnquiry,
    OutOfWarrantySRFSettleRecord,
    OutOfWarrantyVendorChallanCreate,
    OutOfWarrantyVendorChallanDetails,
    OutOfWarrantyVendorNotSettledRecord,
    OutOfWarrantyPending,
    OutOfWarrantySrfNumber,
    UpdateVendorUnsettled,
    UpdateVendorFinalSettlement,
    OutOfWarrantyVendorFinalSettlementRecord,
    UpdateSRFUnsettled,
    UpdateSRFFinalSettlement,
    OutOfWarrantyCreate,
)

master_service = MasterService()


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

    async def create_out_of_warranty(
        self, session: AsyncSession, out_of_warranty: OutOfWarrantyCreate, token: dict
    ):
        parts = out_of_warranty.srf_number.split("/")
        if len(parts) != 2 or not parts[1].isdigit():
            raise IncorrectCodeFormat()
        sub_number = int(parts[1])
        if sub_number < 1 or sub_number > 8:
            raise IncorrectCodeFormat()

        # If frontend requests a new base, generate next base number
        base_part = parts[0]
        if base_part == "NEW":
            for _ in range(3):  # Retry up to 3 times
                next_base = await self.get_next_base_number(session)
                srf_number = f"S{str(next_base).zfill(5)}/1"
                out_of_warranty_dict = out_of_warranty.model_dump()
                out_of_warranty_dict["srf_number"] = srf_number
                master = await master_service.get_master_by_name(out_of_warranty.name, session)
                out_of_warranty_dict["created_by"] = token["user"]["username"]
                out_of_warranty_dict["code"] = master.code
                for date_field in ["srf_date", "collection_date"]:
                    if date_field in out_of_warranty_dict:
                        out_of_warranty_dict[date_field] = parse_date(
                            out_of_warranty_dict[date_field]
                        )
                print(out_of_warranty_dict)
                out_of_warranty_dict.pop("name", None)
                new_out_of_warranty = OutOfWarranty(**out_of_warranty_dict)
                session.add(new_out_of_warranty)
                try:
                    await session.commit()
                    return new_out_of_warranty
                except IntegrityError:
                    await session.rollback()
        else:
            # Use the base provided by frontend, just validate sub-number
            out_of_warranty_dict = out_of_warranty.model_dump()
            master = await master_service.get_master_by_name(out_of_warranty.name, session)
            out_of_warranty_dict["created_by"] = token["user"]["username"]
            out_of_warranty_dict["code"] = master.code
            for date_field in ["srf_date", "collection_date"]:
                if date_field in out_of_warranty_dict:
                    out_of_warranty_dict[date_field] = parse_date(
                        out_of_warranty_dict[date_field]
                    )
            out_of_warranty_dict.pop("name", None)
            new_out_of_warranty = OutOfWarranty(**out_of_warranty_dict)
            session.add(new_out_of_warranty)
            await session.commit()
            return new_out_of_warranty

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

    async def print_srf(
        self, srf_number: OutOfWarrantySrfNumber, token: dict, session: AsyncSession
    ) -> io.BytesIO:
        # Query out_of_warranty and master data for SRF
        statement = (
            select(
                OutOfWarranty.srf_number,
                OutOfWarranty.srf_date,
                OutOfWarranty.division,
                OutOfWarranty.model,
                OutOfWarranty.serial_number,
                OutOfWarranty.remark,
                OutOfWarranty.service_charge,
                OutOfWarranty.code,
                Master.name,
                Master.address,
                Master.contact1,
                Master.gst,
                Master.city,
                Master.pin,
                OutOfWarranty.problem,
            )
            .join(Master, OutOfWarranty.code == Master.code)
            .where(OutOfWarranty.srf_number.like(f"{srf_number}%"))
        )
        result = await session.execute(statement)
        rows = result.fetchall()

        if not rows:
            raise OutOfWarrantyNotFound()

        srf_no = srf_number[:6]
        srf_date = rows[0][1].strftime("%d-%m-%Y") if rows[0][1] else ""
        code = rows[0][7]
        name = rows[0][8]
        pin = ', ' + rows[0][13] if rows[0][13] else ""
        address = rows[0][9] + ', ' + rows[0][12] + pin
        contact1 = rows[0][10]
        gst = rows[0][11] if rows[0][11] else ""
        received_by = token["user"]["username"]

        def generate_overlay(rows, srf_no, srf_date, code, name, address, contact1, gst, received_by):
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=A4)
            width, height = A4

            can.setFont("Helvetica-Bold", 10)
            can.drawString(110, 736, srf_no)
            can.drawString(480, 736, srf_date)
            can.drawString(300, 736, code)
            can.drawString(190, 680, name)
            can.drawString(190, 655, address)
            can.drawString(190, 630, contact1)
            can.drawString(475, 630, gst)
            can.drawString(410, 140, received_by)

            start_y = 556
            y = start_y
            line_spacing = 8
            min_row_height = 16
            row_padding = 7
            columns = [
                {"x": 10, "width": 20},
                {"x": 40, "width": 50},
                {"x": 105, "width": 95},
                {"x": 210, "width": 75},
                {"x": 290, "width": 110},
                {"x": 405, "width": 110},
                {"x": 520, "width": 60},
            ]

            can.setFont("Helvetica", 9)

            for idx, row in enumerate(rows, 1):
                division = row[2] or ''
                model = row[3] or ''
                slno = row[4] or ''
                remark = row[5] or ''
                service_charge_raw = row[6]
                service_charge = f"{service_charge_raw:.2f}"
                problem = row[14] or ''

                row_data = [str(idx), division, model, str(slno), problem, remark, str(service_charge)]

                row_lines = []
                for col, text in zip(columns, row_data):
                    words = text.split()
                    lines = []
                    line = ""
                    for word in words:
                        test_line = line + (" " if line else "") + word
                        if stringWidth(test_line, "Helvetica", 9) <= col["width"]:
                            line = test_line
                        else:
                            lines.append(line)
                            line = word
                    if line:
                        lines.append(line)
                    row_lines.append(lines)

                max_lines = max(len(lines) for lines in row_lines)
                row_height = max(max_lines * line_spacing, min_row_height)

                if y - row_height < 100:
                    can.showPage()
                    can.setFont("Helvetica", 9)
                    y = height - 50

                for col, lines in zip(columns, row_lines):
                    total_text_height = len(lines) * line_spacing
                    vertical_offset = (row_height - total_text_height) / 2

                    for i, ln in enumerate(lines):
                        text_width = stringWidth(ln, "Helvetica", 9)
                        center_x = col["x"] + col["width"] / 2 - text_width / 2
                        y_position = y - vertical_offset - (i * line_spacing)
                        can.drawString(center_x, y_position, ln)

                y -= row_height + row_padding

            can.save()
            packet.seek(0)
            return PdfReader(packet)

        # Create overlays
        overlay_customer = generate_overlay(rows, srf_no, srf_date, code, name, address, contact1, gst, received_by)
        overlay_asc = generate_overlay(rows, srf_no, srf_date, code, name, address, contact1, gst, received_by)

        # Path to the static PDF template (use absolute path for portability, with path injection protection)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        static_dir = os.path.normpath(os.path.join(base_dir, "..", "static"))
        template_path = safe_join(static_dir, "out_of_warranty_receipt.pdf")

        # Read the template PDF
        try:
            with open(template_path, "rb") as f:
                template_bytes = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Template PDF not found at {template_path}")
        template_buffer = io.BytesIO(template_bytes)
        template_pdf = PdfReader(template_buffer)

        # Merge overlays
        writer = PdfWriter()
        page1 = template_pdf.pages[0]
        page1.merge_page(overlay_customer.pages[0])
        writer.add_page(page1)

        if len(template_pdf.pages) > 1:
            page2 = template_pdf.pages[1]
            page2.merge_page(overlay_asc.pages[0])
            writer.add_page(page2)

        output_stream = io.BytesIO()
        writer.write(output_stream)
        output_stream.seek(0)
        return output_stream

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

    
    async def last_vendor_challan_code(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty.challan_number)
            .where(OutOfWarranty.challan_number.isnot(None))
            .order_by(OutOfWarranty.challan_number.desc())
            .limit(1)
        )
        result = await session.execute(statement)
        last_challan_number = result.scalar()
        return last_challan_number or None

    async def list_vendor_challan_details(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty)
            .where(
                 (OutOfWarranty.repair_date.is_(None))
                & (OutOfWarranty.vendor_date1.is_(None))
            )
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantyVendorChallanDetails(
                srf_number=row.OutOfWarranty.srf_number,
                division=row.OutOfWarranty.division,
                model=row.OutOfWarranty.model,
                serial_number=row.OutOfWarranty.serial_number,
                challan=row.OutOfWarranty.challan,
            )
            for row in rows
        ]

    async def create_vendor_challan(
        self,
        list_vendor_challan: List[OutOfWarrantyVendorChallanCreate],
        session: AsyncSession,
    ):
        for record in list_vendor_challan:
            statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == record.srf_number)
            result = await session.execute(statement)
            existing_warranty = result.scalar_one_or_none()
            if existing_warranty:
                existing_warranty.challan = record.challan
                existing_warranty.challan_number = record.challan_number
                existing_warranty.vendor_date1 = record.vendor_date1
                existing_warranty.received_by = record.received_by
                session.add(existing_warranty)
        await session.commit()


    async def print_vendor_challan(
        self, challan_number: str, token: dict, session: AsyncSession
    ) -> io.BytesIO:
        # Query out_of_warranty data for challan_number
        statement = (
            select(
                OutOfWarranty.challan_number,
                OutOfWarranty.vendor_date1,
                OutOfWarranty.received_by,
                OutOfWarranty.srf_number,
                OutOfWarranty.division,
                OutOfWarranty.model,
                OutOfWarranty.serial_number,
                OutOfWarranty.remark,
            )
            .where(OutOfWarranty.challan_number == challan_number)
        )
        result = await session.execute(statement)
        rows = result.fetchall()

        if not rows:
            raise OutOfWarrantyNotFound()

        challan_date = rows[0][1].strftime("%d-%m-%Y") if rows[0][1] else ""
        received_by = rows[0][2]

        def generate_overlay(rows, challan_no, challan_date, received_by):
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=A4)
            width, height = A4

            def draw_block(start_y_offset):
                # Header
                can.setFont("Helvetica-Bold", 10)
                can.drawString(140, 735 - start_y_offset, challan_no)
                can.drawString(490, 735 - start_y_offset, challan_date)
                can.drawString(220, 700 - start_y_offset, received_by)

                # Table
                y = 661 - start_y_offset
                line_spacing = 8
                min_row_height = 20
                row_padding = 0.2

                columns = [
                    {"x": 21,  "width": 21},   # Sl No
                    {"x": 46,  "width": 74},   # SRF No
                    {"x": 125, "width": 85},   # Division
                    {"x": 220, "width": 100},  # Model
                    {"x": 330, "width": 100},  # Serial No
                    {"x": 440, "width": 135},  # Remark
                ]

                can.setFont("Helvetica", 8)

                for idx, row in enumerate(rows, 1):
                    srf = row[3] or ''
                    division = row[4] or ''
                    model = row[5] or ''
                    slno = row[6] or ''
                    remark = row[7] or ''

                    row_data = [str(idx), srf, division, model, str(slno), remark]

                    row_lines = []
                    for col, text in zip(columns, row_data):
                        words = str(text).split()
                        lines = []
                        line = ""
                        for word in words:
                            test_line = line + (" " if line else "") + word
                            if stringWidth(test_line, "Helvetica", 9) <= col["width"]:
                                line = test_line
                            else:
                                lines.append(line)
                                line = word
                        if line:
                            lines.append(line)
                        row_lines.append(lines)

                    max_lines = max(len(lines) for lines in row_lines)
                    row_height = max(max_lines * line_spacing, min_row_height)

                    for col, lines in zip(columns, row_lines):
                        total_text_height = len(lines) * line_spacing
                        vertical_offset = (row_height - total_text_height) / 2
                        for i, ln in enumerate(lines):
                            text_width = stringWidth(ln, "Helvetica", 9)
                            center_x = col["x"] + col["width"] / 2 - text_width / 2
                            y_position = y - vertical_offset - (i * line_spacing)
                            can.drawString(center_x, y_position, ln)

                    y -= row_height + row_padding

            # Draw both blocks
            draw_block(start_y_offset=0)      # First copy
            draw_block(start_y_offset=393)    # Second copy lower

            can.save()
            packet.seek(0)
            return PdfReader(packet)

        overlay = generate_overlay(rows, challan_number, challan_date, received_by)

        # Path to the static PDF template (use absolute path for portability, with path injection protection)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        static_dir = os.path.normpath(os.path.join(base_dir, "..", "static"))
        template_path = safe_join(static_dir, "vendor_challan.pdf")

        # Read the template PDF
        try:
            with open(template_path, "rb") as f:
                template_bytes = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Template PDF not found at {template_path}")
        template_buffer = io.BytesIO(template_bytes)
        template_pdf = PdfReader(template_buffer)

        # Merge overlays
        writer = PdfWriter()
        for i in range(len(template_pdf.pages)):
            page = template_pdf.pages[i]
            overlay_page = overlay.pages[min(i, len(overlay.pages) - 1)]
            page.merge_page(overlay_page)
            writer.add_page(page)

        output_stream = io.BytesIO()
        writer.write(output_stream)
        output_stream.seek(0)
        return output_stream

    async def enquiry_out_of_warranty(
        self,
        session: AsyncSession,
        final_status: Optional[str] = None,
        name: Optional[str] = None,
        division: Optional[str] = None,
        from_srf_date: Optional[date] = None,
        to_srf_date: Optional[date] = None,
        estimated: Optional[str] = None,
        final_settled: Optional[str] = None,
        challaned: Optional[str] = None,
        vendor_settled: Optional[str] = None,
        delivered: Optional[str] = None,
        repaired: Optional[str] = None,
    ):

        statement = select(OutOfWarranty, Master).join(Master, OutOfWarranty.code == Master.code)

        if final_status:
            statement = statement.where(OutOfWarranty.final_status == final_status)

        if name:
            statement = statement.where(Master.name.ilike(f"%{name}%"))

        if division:
            statement = statement.where(OutOfWarranty.division == division)

        if from_srf_date:
            statement = statement.where(OutOfWarranty.srf_date >= from_srf_date)

        if to_srf_date:
            statement = statement.where(OutOfWarranty.srf_date <= to_srf_date)
            
        if final_settled:
            statement = statement.where(OutOfWarranty.final_settled == final_settled)
    
        if vendor_settled:
            statement = statement.where(OutOfWarranty.vendor_settled == vendor_settled)

        from sqlalchemy import or_
        if delivered:
            if delivered == "Y":
                statement = statement.where(
                    OutOfWarranty.delivery_date.isnot(None)
                )
            else:
                statement = statement.where(
                    OutOfWarranty.delivery_date.is_(None)
                )

        if estimated:
            if estimated == "Y":
                statement = statement.where(
                    OutOfWarranty.estimate_date.isnot(None)
                )
            else:
                statement = statement.where(
                    OutOfWarranty.estimate_date.is_(None)
                )

        if repaired:
            if repaired == "Y":
                statement = statement.where(
                    OutOfWarranty.repair_date.isnot(None)
                )
            else:
                statement = statement.where(
                    OutOfWarranty.repair_date.is_(None)
                )
        
        if challaned:
            if challaned == "Y":
                statement = statement.where(OutOfWarranty.vendor_date1.isnot(None))
            else:
                statement = statement.where(OutOfWarranty.vendor_date1.is_(None))

        statement = statement.order_by(OutOfWarranty.srf_number)

        result = await session.execute(statement)
        rows = result.all()

        return [
            OutOfWarrantyEnquiry(
                srf_number=row.OutOfWarranty.srf_number,
                srf_date=format_date_ddmmyyyy(row.OutOfWarranty.srf_date),
                name=row.Master.name,
                model=row.OutOfWarranty.model,
                estimate_date=format_date_ddmmyyyy(row.OutOfWarranty.estimate_date) if row.OutOfWarranty.estimate_date else "",
                repair_date=format_date_ddmmyyyy(row.OutOfWarranty.repair_date) if row.OutOfWarranty.repair_date else "",
                vendor_date1=format_date_ddmmyyyy(row.OutOfWarranty.vendor_date1) if row.OutOfWarranty.vendor_date1 else "",
                delivery_date=format_date_ddmmyyyy(row.OutOfWarranty.delivery_date) if row.OutOfWarranty.delivery_date else "",
                final_amount=row.OutOfWarranty.final_amount if row.OutOfWarranty.final_amount else 0,
                contact_number=row.Master.contact1,
            )
            for row in rows
        ]

    async def list_received_by(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty.received_by)
            .distinct()
            .where(OutOfWarranty.received_by.isnot(None))
        )
        result = await session.execute(statement)
        names = result.scalars().all()
        return names
    
    async def list_vendor_not_settled(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty)
            .where(OutOfWarranty.vendor_date2.isnot(None) & (OutOfWarranty.vendor_settlement_date.is_(None)))
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantyVendorNotSettledRecord(
                srf_number=row.OutOfWarranty.srf_number,
                division=row.OutOfWarranty.division,
                model=row.OutOfWarranty.model,
                challan_number=row.OutOfWarranty.challan_number,
                amount=(row.OutOfWarranty.vendor_cost1 or 0) + (row.OutOfWarranty.vendor_cost2 or 0),
                vendor_bill_number=row.OutOfWarranty.vendor_bill_number,
                received_by=row.OutOfWarranty.received_by,
            )
            for row in rows
        ]

    async def update_vendor_unsettled(
        self, list_vendor: List[UpdateVendorUnsettled], session: AsyncSession
    ):
        for vendor in list_vendor:
            statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == vendor.srf_number)
            result = await session.execute(statement)
            existing_vendor = result.scalar_one_or_none()
            if existing_vendor:
                existing_vendor.vendor_settlement_date = vendor.vendor_settlement_date
                existing_vendor.vendor_bill_number = vendor.vendor_bill_number
        await session.commit()

    async def list_final_vendor_settlement(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty)
            .where((OutOfWarranty.vendor_settlement_date.isnot(None)) & (OutOfWarranty.vendor_settled == "N"))
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantyVendorFinalSettlementRecord(
                srf_number=row.OutOfWarranty.srf_number,
                division=row.OutOfWarranty.division,
                model=row.OutOfWarranty.model,
                challan_number=row.OutOfWarranty.challan_number,
                vendor_cost1=row.OutOfWarranty.vendor_cost1 or 0,
                vendor_cost2=row.OutOfWarranty.vendor_cost2 or 0,
                vendor_bill_number=row.OutOfWarranty.vendor_bill_number,
                received_by=row.OutOfWarranty.received_by,
                amount=(row.OutOfWarranty.vendor_cost1 or 0) + (row.OutOfWarranty.vendor_cost2 or 0),
            )
            for row in rows
        ]

    async def update_final_vendor_settlement(
        self, list_vendor: List[UpdateVendorFinalSettlement], session: AsyncSession
    ):
        for vendor in list_vendor:
            statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == vendor.srf_number)
            result = await session.execute(statement)
            existing_vendor = result.scalar_one_or_none()
            if existing_vendor:
                existing_vendor.vendor_cost1 = vendor.vendor_cost1
                existing_vendor.vendor_cost2 = vendor.vendor_cost2
                existing_vendor.vendor_settled = vendor.vendor_settled
        await session.commit()

    async def list_srf_not_settled(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty, Master)
            .join(Master, OutOfWarranty.code == Master.code)
            .where(OutOfWarranty.settlement_date.is_(None) & (OutOfWarranty.final_status == "Y"))
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantySRFSettleRecord(
                srf_number=row.OutOfWarranty.srf_number,
                name=row.Master.name,
                model=row.OutOfWarranty.model,
                delivery_date=row.OutOfWarranty.delivery_date,
                final_amount=row.OutOfWarranty.final_amount,
                received_by=row.OutOfWarranty.received_by,
                pc_number=row.OutOfWarranty.pc_number,
                invoice_number=row.OutOfWarranty.invoice_number,
                service_charge=row.OutOfWarranty.service_charge,
            )
            for row in rows
        ]

    async def update_srf_unsettled(
        self, list_srf: List[UpdateSRFUnsettled], session: AsyncSession
    ):
        for srf in list_srf:
            statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == srf.srf_number)
            result = await session.execute(statement)
            existing_srf = result.scalar_one_or_none()
            if existing_srf:
                existing_srf.settlement_date = srf.settlement_date
        await session.commit()

    async def list_final_srf_settlement(self, session: AsyncSession):
        statement = (
            select(OutOfWarranty, Master)
            .join(Master, OutOfWarranty.code == Master.code)
            .where(OutOfWarranty.settlement_date.isnot(None) & (OutOfWarranty.final_settled == "N"))
            .order_by(OutOfWarranty.srf_number)
        )
        result = await session.execute(statement)
        rows = result.all()
        return [
            OutOfWarrantySRFSettleRecord(
                srf_number=row.OutOfWarranty.srf_number,
                name=row.Master.name,
                model=row.OutOfWarranty.model,
                delivery_date=row.OutOfWarranty.delivery_date,
                final_amount=row.OutOfWarranty.final_amount,
                received_by=row.OutOfWarranty.received_by,
                pc_number=row.OutOfWarranty.pc_number,
                invoice_number=row.OutOfWarranty.invoice_number,
                service_charge=row.OutOfWarranty.service_charge,
            )
            for row in rows
        ]

    async def update_final_srf_settlement(
        self, list_srf: List[UpdateSRFFinalSettlement], session: AsyncSession
    ):
        for srf in list_srf:
            statement = select(OutOfWarranty).where(OutOfWarranty.srf_number == srf.srf_number)
            result = await session.execute(statement)
            existing_srf = result.scalar_one_or_none()
            if existing_srf:
                existing_srf.final_settled = srf.final_settled
        await session.commit()