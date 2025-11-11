import sqlalchemy.dialects.postgresql as pg
from sqlmodel import Column, Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(sa_column=Column(pg.INTEGER, primary_key=True, autoincrement=True))
    username: str = Field(unique=True)
    password: str = Field(exclude=True)
    role: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, server_default="USER")
    )
    phone_number: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))

    def __repr__(self):
        return f"<User {self.username}>"
