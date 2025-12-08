from datetime import datetime, timedelta

import pytz
from sqlalchemy.future import select

from db.db import get_session
from db.models import BlockedJTI

JTI_EXPIRY = 3600 * 3  # 3 hours


async def add_jti_to_blocklist(jti: str) -> None:
    from sqlalchemy.dialects.postgresql import insert

    async for session in get_session():
        ist = pytz.timezone("Asia/Kolkata")
        expires_at = (datetime.now(ist) + timedelta(seconds=JTI_EXPIRY)).replace(
            tzinfo=None
        )
        statement = (
            insert(BlockedJTI)
            .values(jti=jti, expires_at=expires_at)
            .on_conflict_do_nothing(index_elements=[BlockedJTI.jti])
        )
        await session.execute(statement)
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
