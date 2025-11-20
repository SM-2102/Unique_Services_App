
## Unique Services App - Developer Guide

---

## To Do List

- Backup
- Implement page not found
- Master Create - Refresh
- Make all forms refresh after submission
- Master Update name span w-full
- Menu Dashbaord Spinner not rendering
- Change master route to by_code and by_name
- Road Challan 
- Market 

  
---

## Frontend Pages Progress

### Auth Module
- [x] **LoginPage** – User authentication

### User Module
- [x] **CreateUserPage** – Create User [ADMIN]
- [x] **DeleteUserPage** – Delete User [ADMIN]
- [x] **ShowAllUsersPage** – View All Users [ADMIN]
- [x] **ShowStandardUsersPage** - View Standard Users
- [x] **ChangePasswordPage** – Change password

### Dashboard Module
- [x] **MenuDashboardPage** – Main dashboard for menu navigation
- [x] **PageNotFound** – 404 error page
- [x] **PageNotAvailable** – Maintenance/feature unavailable page

### Master Module
- [x] **MasterCreatePage** - Create Master record
- [x] **MasterUpdatePage** - Update Master record

### Road Challan Module
- [ ] **RoadChallanCreatePage** - Create Road Challan record
- [ ] **RoadChallanPrintPage** - Print Road Challan record

### Market Module
- [ ] **MarketCreatePage** - Create Market record
- [ ] **MarketUpdatePage** - Update Market record
- [ ] **MarketEnquriryPage** - Market Enquiry and Print

---


## Backend Routes Progress

### Auth Module
- [x] **/auth/login**
- [x] **/auth/logout**
- [x] **/auth/me**

### User Module
- [x] **/user/all_users** - [ADMIN]
- [x] **/user/standard_users** 
- [x] **/user/create_user** - [ADMIN]
- [x] **/user/delete_user** - [ADMIN]
- [x] **/user/reset_password**

### Menu Module
- [x] **/menu/dashboard**

### Master Module
- [x] **/master/create**
- [x] **/master/next_code**
- [x] **/master/check_available**
- [x] **/master/list_names** 
- [x] **/master/by_code** 
- [x] **/master/by_name**
- [x] **/master/patch/{code}**
- [ ] **/master/fetch_address** 

### Challan Module
- [ ] **/road_challan/next_code**
- [ ] **/road_challan/create**
- [ ] **/road_challan/last_challan_code**
- [ ] **/road_challan/print**

### Market Module
- [ ] **/market/create**
- [ ] **/market/by_code**
- [ ] **/market/update**
- [ ] **/market/pending**
- [ ] **/market/search**

---

## Application Development Progress

- [x] **Authorization**
- [ ] **Database Schema** - needs refinement - Settlement
- [x] **Initial Deployment**
- [ ] **Backup**
- [x] **Login & Menu**
- [x] **User**
- [x] **Master**
- [ ] **Retail**
- [ ] **Market**
- [ ] **Challan**
- [ ] **Warranty**
- [ ] **Out of Warranty**
- [ ] **Final Deployment**

---




