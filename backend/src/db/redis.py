# import redis.asyncio as redis

# from src.config import Config

# JTI_EXPIRY = 3600

# token_blocklist = redis.Redis(
#     host=Config.REDIS_HOST,
#     port=Config.REDIS_PORT,
#     decode_responses=True,
#     username=Config.REDIS_USERNAME,
#     password=Config.REDIS_PASSWORD,
# )


# async def add_jti_to_blocklist(jti: str) -> None:
#     await token_blocklist.set(name=jti, value="", ex=JTI_EXPIRY)


# async def jti_in_blocklist(jti: str) -> bool:
#     token = await token_blocklist.get(name=jti)
#     return token is not None
