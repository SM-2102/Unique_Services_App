## Production Instructions

- Do NOT copy `config.py`
- Do NOT copy the `middleware/` directory
- Do NOT copy the `migrations/` folder
- Do NOT copy the `db/` folder
- __init__.py must be copied to main.py
- Remove `src.` from all files
- In `main.py` change the `.exceptions` import
- In `main.py` change the `.middleware` import
- `samesite` of `set.cookie` has to be set `none`

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
