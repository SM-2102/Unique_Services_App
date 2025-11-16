from datetime import datetime, timedelta

from sqlalchemy.future import select

from src.db.db import get_session
from src.db.models import BlockedJTI

JTI_EXPIRY = 3600 # seconds


async def add_jti_to_blocklist(jti: str) -> None:
    async for session in get_session():
        expires_at = datetime.utcnow() + timedelta(seconds=JTI_EXPIRY)
        blocked = BlockedJTI(jti=jti, expires_at=expires_at)
        session.add(blocked)
        await session.commit()


async def jti_in_blocklist(jti: str) -> bool:
    async for session in get_session():
        result = await session.execute(
            select(BlockedJTI).where(
                BlockedJTI.jti == jti, BlockedJTI.expires_at > datetime.utcnow()
            )
        )
        blocked = result.scalar_one_or_none()
        return blocked is not None
