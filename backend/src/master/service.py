from sqlalchemy import func, select, union_all
from sqlalchemy.ext.asyncio.session import AsyncSession

from src.challan.models import Challan
from src.exceptions import IncorrectCodeFormat, MasterAlreadyExists, MasterNotFound
from src.market.models import Market
from src.out_of_warranty.models import OutOfWarranty
from src.retail.models import Retail
from src.warranty.models import Warranty

from .models import Master
from .schemas import CreateMaster, UpdateMaster


class MasterService:

    async def create_master(
        self, session: AsyncSession, master: CreateMaster, token: dict
    ):
        master_data_dict = master.model_dump()
        master_data_dict["code"] = await self.master_next_code(session)
        if await self.check_master_name_available(master.name, session):
            raise MasterAlreadyExists()
        master_data_dict["created_by"] = token["user"]["username"]
        new_master = Master(**master_data_dict)
        session.add(new_master)
        await session.commit()
        return new_master

    async def master_next_code(self, session: AsyncSession):
        statement = select(Master.code).order_by(Master.code.desc()).limit(1)
        result = await session.execute(statement)
        last_code = result.scalar()
        last_number = last_code[1:] if last_code else "0"
        next_code = int(last_number) + 1
        next_code = "C" + str(next_code).zfill(4)
        return next_code

    async def check_master_name_available(
        self, name: str, session: AsyncSession
    ) -> bool:
        statement = select(Master).where(Master.name == name)
        result = await session.execute(statement)
        existing_name = result.scalar()
        if existing_name:
            return True
        return False

    async def list_master_names(self, session: AsyncSession):
        statement = select(Master.name)
        result = await session.execute(statement)
        names = result.scalars().all()
        return names

    async def get_master_by_code(self, code: str, session: AsyncSession):
        if not code.startswith("C") or len(code) != 5 or not code[1:].isdigit():
            raise IncorrectCodeFormat()
        statement = select(Master).where(Master.code == code)
        result = await session.execute(statement)
        master = result.scalars().first()
        if master:
            return master
        else:
            raise MasterNotFound()

    async def get_master_by_name(self, name: str, session: AsyncSession):
        statement = select(Master).where(Master.name == name)
        result = await session.execute(statement)
        master = result.scalars().first()
        if master:
            return master
        else:
            raise MasterNotFound()

    async def update_master(
        self, code: str, master: UpdateMaster, session: AsyncSession, token: dict
    ):
        existing_master = await self.get_master_by_code(code, session)
        for key, value in master.model_dump().items():
            setattr(existing_master, key, value)
        existing_master.updated_by = token["user"]["username"]
        await session.commit()
        await session.refresh(existing_master)
        return existing_master

    async def number_of_masters(self, session: AsyncSession):
        statement = select(func.count(Master.code))
        result = await session.execute(statement)
        return result.scalar()

    async def top_customers(self, session: AsyncSession):
        select_statement = (
            select(Master.code),
            select(Retail.code),
            select(Challan.code),
            select(Market.code),
            select(Warranty.code),
            select(OutOfWarranty.code),
        )
        combined_cte = union_all(*select_statement).cte("combined_cte")
        statement = (
            select(Master.name, func.count().label("total_count"))
            .join(combined_cte, Master.code == combined_cte.c.code)
            .group_by(Master.name)
            .order_by(func.count().desc())
            .limit(5)
        )
        result = await session.execute(statement)
        top_customers = result.all()
        return {row.name: row.total_count for row in top_customers}
