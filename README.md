
## Unique Services App - Developer Guide

---

## To Do List

- Out of Warranty Card
- Role based Frontend Side

---

## Frontend Pages Progress

### Auth Module
- [ ] **LoginPage** – User authentication
- [ ] **CreateUser** – Create User [ADMIN]
- [ ] **DeleteUser** – Delete User [ADMIN]
- [ ] **ViewAllUsers** – View All Users [ADMIN]
- [ ] **PasswordChange** – Change password

### Dashboard Module
- [ ] **MenuDashboard** – Main dashboard for menu navigation
- [x] **PageNotFound** – 404 error page
- [x] **PageNotAvailable** – Maintenance/feature unavailable page

---


## Backend Routes Progress

### Auth Module
- [ ] **/auth/login**
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/logout**
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/users** - [ADMIN]
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/create_user** - [ADMIN]
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/delete_user** - [ADMIN]
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/reset_password**
	- [ ] FastAPI
	- [ ] React
- [ ] **/auth/me**
	- [ ] FastAPI
	- [ ] React

### Menu Module
- [ ] **/menu/dashboard**
	- [ ] FastAPI
	- [ ] React

---

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

### Format Frontend Code
```powershell
npx prettier --write .
```


