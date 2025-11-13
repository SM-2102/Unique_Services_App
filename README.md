## Unique Services App - Developer Guide

### How to Run the Application
1. Create and activate a Python virtual environment:
	```powershell
	python -m venv .venv
	.\.venv\Scripts\Activate.ps1
	```
2. Install dependencies:
	```powershell
	pip install -r requirements.txt
	```
3. Start the FastAPI server:
	```powershell
	uvicorn src.main:app --reload
	```
4. Open API docs:
	- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
	- OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### Alembic Database Migrations
1. Initialize Alembic (run once):
	```powershell
	alembic init migrations
	```
2. Create a new migration revision:
	```powershell
	alembic revision --autogenerate -m "Initial migration"
	```
3. Apply migrations:
	```powershell
	alembic upgrade head
	```

### JWT Token Usage
Create JWT Token - `import secrets` and `secrets.token_hex(16)`
