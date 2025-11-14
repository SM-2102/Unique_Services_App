from datetime import datetime

from sqlmodel import Column, Field, SQLModel


class BlockedJTI(SQLModel, table=True):
    jti: str = Field(primary_key=True, index=True)
    expires_at: datetime = Field(nullable=False)
