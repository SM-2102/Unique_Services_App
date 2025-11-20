## Production Instructions

- Do NOT copy the `middleware/` directory
- Do NOT copy the `migrations/` folder
- Do NOT copy the `db/` folder
- `samesite` of `set.cookie` has to be set to `none`
- `secure` of `set_cookie` has to be set to `true`

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