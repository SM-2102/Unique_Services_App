from fastapi import FastAPI

from src.auth.routes import auth_router
from src.master.routes import master_router
from src.menu.routes import menu_router

from .exceptions import register_exceptions
from .middleware.middleware import register_middleware

version = "v1"

app = FastAPI(
    version=version,
    title="Unique Services",
    description="Unique Services Management System",
    license_info={"name": "MIT License", "url": "https://opensource.org/license/mit"},
    contact={
        "name": "Sukanya Manna",
        "url": "https://github.com/SM-2102",
        "email": "sukanya.manna.2002@gmail.com",
    },
    openapi_url=f"/openapi.json",
    docs_url=f"/docs",
    redoc_url=f"/redoc",
)


# Register middleware
register_middleware(app)

# Register exception handlers
register_exceptions(app)

# Routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
# app.include_router(master_router, prefix="/master", tags=["Master"])
app.include_router(menu_router, prefix="/menu", tags=["Menu"])
