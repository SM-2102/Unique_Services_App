
## Unique Services App - Developer Guide

---

## To Do List



  
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
- [x] **RoadChallanCreatePage** - Create Road Challan record
- [x] **RoadChallanPrintPage** - Print Road Challan record

### Market Module
- [x] **MarketCreatePage** - Create Market record
- [x] **MarketUpdatePage** - Update Market record
- [x] **MarketEnquiryPage** - Market Enquiry

### Retail Module
- [x] **RetailCreatePage** - Create Retail record
- [x] **RetailUpdatePage** - Update Retail record
- [x] **RetailEnquiryPage** - Retail Enquiry
- [x] **RetailPrintPage** - Retail Print Receipt
- [x] **RetailSettleUser** - Proposed For Settlement
- [x] **RetailSettleAdmin** - Settled Retail Record [ADMIN]

### Warranty Module
- [x] **WarrantyCreatePage** - Create Warranty record
- [x] **WarrantyUpdatePage** - Update Warranty record
- [x] **WarrantySRFPrintPage** - Warranty SRF Print
- [x] **WarrantyChallanPage** - Warranty Challan
- [x] **WarrantyChallanPrintPage** - Warranty Challan Print
- [x] **WarrantyEnquiryPage** - Warranty Enquiry Page

### Warranty Module
- [ ] **WarrantyCreatePage** - Create Warranty record
- [ ] **WarrantyUpdatePage** - Update Warranty record
- [ ] **WarrantySRFPrintPage** - Warranty SRF Print
- [ ] **WarrantyChallanPage** - Warranty Challan
- [ ] **WarrantyChallanPrintPage** - Warranty Challan Print
- [ ] **WarrantyEnquiryPage** - Warranty Enquiry Page


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
- [x] **/master/list_names** 
- [x] **/master/by_code** 
- [x] **/master/by_name**
- [x] **/master/update{code}**
- [x] **/master/fetch_address**

### Challan Module
- [x] **/road_challan/next_code**
- [x] **/road_challan/create**
- [x] **/road_challan/last_challan_code**
- [x] **/road_challan/print**

### Market Module
- [x] **/market/next_code** 
- [x] **/market/pending**
- [x] **/market/create**
- [x] **/market/by_code** 
- [x] **/market/update{code}**
- [x] **/market/enquiry{params}**
- [x] **/market/list_delivered_by**
- [x] **/market/list_invoice_number**

### Retail Module
- [x] **/retail/next_code**
- [x] **/retail/create**
- [x] **/retail/list_of_not_received**
- [x] **/retail/update_received**
- [x] **/retail/list_of_unsettled**
- [x] **/retail/update_unsettled**
- [x] **/retail/list_of_final_settlement** - [ADMIN]
- [x] **/retail/update_final_settlement** - [ADMIN]
- [x] **/retail/show_receipt_names**
- [x] **/reetail/print**
- [x] **/retail/enquiry{params}**

### Warranty Module
- [x] **warranty/next_srf_number**
- [x] **warranty/create**
- [x] **warranty/list_pending**
- [x] **warranty/by_srf_number**
- [x] **warranty/update/{srf_number}**
- [x] **warranty/list_delivered_by**
- [x] **warranty/last_srf_number**
- [x] **warranty/srf_print**
- [x] **warranty/next_cnf_challan_code**
- [x] **warranty/last_cnf_challan_code**
- [x] **warranty/list_cnf_challan**
- [x] **warranty/create_cnf_challan**
- [x] **warranty/cnf_challan_print**
- [x] **warranty/enquiry{params}**

### Service Center Module
- [x] **/service_center/list_names**

### OutOfWarranty Module - [ADMIN]
- [x] **out_of_warranty/next_srf_number**
- [ ] **out_of_warranty/create**
- [x] **out_of_warranty/list_pending**
- [ ] **out_of_warranty/by_srf_number**
- [ ] **out_of_warranty/update/{srf_number}**
- [ ] **out_of_warranty/last_srf_number**
- [ ] **out_of_warranty/srf_print**
- [x] **out_of_warranty/next_cnf_challan_code**
- [x] **out_of_warranty/last_cnf_challan_code**
- [ ] **out_of_warranty/list_cnf_challan**
- [ ] **out_of_warranty/create_cnf_challan**
- [ ] **out_of_warranty/cnf_challan_print**
- [ ] **out_of_warranty/enquiry{params}**


---

## Application Development Progress

- [x] **Authorization**
- [x] **Database Schema**
- [x] **Initial Deployment**
- [x] **Backup**
- [x] **Login & Menu**
- [x] **User**
- [x] **Master**
- [x] **Retail**
- [x] **Market**
- [x] **Challan**
- [x] **Warranty**
- [ ] **Out of Warranty**
- [ ] **Final Deployment**

---



