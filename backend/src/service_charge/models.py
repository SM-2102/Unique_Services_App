from datetime import date

import sqlalchemy.dialects.postgresql as pg
from sqlmodel import Column, Field, SQLModel


class OW_Service_Charge(SQLModel, table=True):
    __tablename__ = "ow_service_charge"
    id: int = Field(sa_column=Column(pg.INTEGER, primary_key=True, autoincrement=True))
    division: str = Field(sa_column=Column(pg.VARCHAR(10), nullable=False))
    head: str = Field(sa_column=Column(pg.VARCHAR(15), nullable=True))
    service_charge: int = Field(sa_column=Column(pg.INTEGER, nullable=False))

    def __repr__(self):
        return f"<OW_Service_Charge {self.division} - {self.head}>"
