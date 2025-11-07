import uuid

import sqlalchemy.dialects.postgresql as pg
from sqlmodel import Column, Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    username: str = Field(unique=True)
    password: str = Field(exclude=True)
    role: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, server_default="USER")
    )

    def __repr__(self):
        return f"<User {self.username}>"
