
## Unique Services App - Developer Guide

---
### To Do List 
 - Comments
 - Function name
 - File Names
 - Unused imports
 - Pretty print


## Frontend Pages Progress

### Auth Module
- [ ] **LoginPage** – User authentication

### User Module
- [ ] **CreateUserPage** – Create User [ADMIN]
- [ ] **DeleteUserPage** – Delete User [ADMIN]
- [ ] **ShowAllUsersPage** – View All Users [ADMIN]
- [ ] **ShowStandardUsersPage** - View Standard Users
- [ ] **ChangePasswordPage** – Change password

### Dashboard Module
- [ ] **MenuDashboardPage** – Main dashboard for menu navigation
- [ ] **PageNotFound** – 404 error page
- [ ] **PageNotAvailable** – Maintenance/feature unavailable page

### Master Module
- [ ] **MasterCreatePage** - Create Master record
- [ ] **MasterUpdatePage** - Update Master record
- [ ] **ServiceCenterCreatePage** - Add Service Center

### Road Challan Module
- [ ] **RoadChallanCreatePage** - Create Road Challan record
- [ ] **RoadChallanPrintPage** - Print Road Challan record

### Market Module
- [ ] **MarketCreatePage** - Create Market record
- [ ] **MarketUpdatePage** - Update Market record
- [ ] **MarketEnquiryPage** - Market Enquiry

### Retail Module
- [ ] **RetailCreatePage** - Create Retail record
- [ ] **RetailUpdatePage** - Update Retail record
- [ ] **RetailEnquiryPage** - Retail Enquiry
- [ ] **RetailPrintPage** - Retail Print Receipt
- [ ] **RetailSettleUserPage** - Proposed For Settlement
- [ ] **RetailSettleAdminPage** - Settled Retail Record [ADMIN]

### Warranty Module
- [ ] **WarrantyCreatePage** - Create Warranty record
- [ ] **WarrantyUpdatePage** - Update Warranty record
- [ ] **WarrantySRFPrintPage** - Warranty SRF Print
- [ ] **WarrantyChallanPage** - Warranty Challan
- [ ] **WarrantyChallanPrintPage** - Warranty Challan Print
- [ ] **WarrantyEnquiryPage** - Warranty Enquiry Page

### OutOfWarranty Module
- [ ] **OutOFWarrantyCreatePage** - Create Out Of Warranty record
- [ ] **OutOFWarrantyUpdatePage** - Update Out Of Warranty record
- [ ] **OutOFWarrantySRFPrintPage** - Out Of Warranty SRF Print
- [ ] **OutOFWarrantySRFSettleUserPage** - Out Of Warranty SRF Propose to Settle
- [ ] **OutOFWarrantySRFSettleAdminPage** - Out Of Warranty SRF Settlement [ADMIN]
- [ ] **OutOfWarrantyEstimatePrintPage** - Out Of Warranty Estimate Print
- [ ] **OutOFWarrantyCreateVendorPage** - Out Of Warranty Vendor Challan
- [ ] **OutOFWarrantyChallanPrintPage** - Out Of Warranty Vendor Challan Print
- [ ] **OutOFWarrantyChallanSettleUserPage** - Out Of Warranty Challan Propose to Settle
- [ ] **OutOFWarrantyChallanSettleAdminPage** - Out Of Warranty Challan Settlement [ADMIN]
- [ ] **OutOFWarrantyEnquiryPage** - Out Of Warranty Enquiry Page

---


## Backend Routes Progress

### Auth Module
- [ ] **/auth/login**
- [ ] **/auth/logout**
- [ ] **/auth/me**

### User Module
- [ ] **/user/all_users** - [ADMIN]
- [ ] **/user/standard_users** 
- [ ] **/user/create_user** - [ADMIN]
- [ ] **/user/delete_user** - [ADMIN]
- [ ] **/user/reset_password**

### Menu Module
- [ ] **/menu/dashboard**

### Master Module
- [ ] **/master/create**
- [ ] **/master/next_code**
- [ ] **/master/list_names** 
- [ ] **/master/by_code** 
- [ ] **/master/by_name**
- [ ] **/master/update{code}**
- [ ] **/master/fetch_address**

### Challan Module
- [ ] **/road_challan/next_code**
- [ ] **/road_challan/create**
- [ ] **/road_challan/last_challan_code**
- [ ] **/road_challan/print**

### Market Module
- [ ] **/market/next_code** 
- [ ] **/market/pending**
- [ ] **/market/create**
- [ ] **/market/by_code** 
- [ ] **/market/update{code}**
- [ ] **/market/enquiry{params}**
- [ ] **/market/list_delivered_by**
- [ ] **/market/list_invoice_number**

### Retail Module
- [ ] **/retail/next_code**
- [ ] **/retail/create**
- [ ] **/retail/list_of_not_received**
- [ ] **/retail/update_received**
- [ ] **/retail/list_of_unsettled**
- [ ] **/retail/update_unsettled**
- [ ] **/retail/list_of_final_settlement** - [ADMIN]
- [ ] **/retail/update_final_settlement** - [ADMIN]
- [ ] **/retail/show_receipt_names**
- [ ] **/reetail/print**
- [ ] **/retail/enquiry{params}**

### Warranty Module
- [ ] **warranty/next_srf_number**
- [ ] **warranty/create**
- [ ] **warranty/list_pending**
- [ ] **warranty/by_srf_number**
- [ ] **warranty/update/{srf_number}**
- [ ] **warranty/list_delivered_by**
- [ ] **warranty/last_srf_number**
- [ ] **warranty/srf_print**
- [ ] **warranty/next_cnf_challan_code**
- [ ] **warranty/last_cnf_challan_code**
- [ ] **warranty/list_cnf_challan**
- [ ] **warranty/create_cnf_challan**
- [ ] **warranty/cnf_challan_print**
- [ ] **warranty/enquiry{params}**

### Service Center Module
- [ ] **/service_center/list_names**
- [ ] **/service_center/create**

### OutOfWarranty Module - [ADMIN]
- [ ] **out_of_warranty/next_srf_number**
- [ ] **out_of_warranty/create**
- [ ] **out_of_warranty/list_pending**
- [ ] **out_of_warranty/by_srf_number**
- [ ] **out_of_warranty/update/{srf_number}**
- [ ] **out_of_warranty/last_srf_number**
- [ ] **out_of_warranty/srf_print**
- [ ] **out_of_warranty/next_vendor_challan_code**
- [ ] **out_of_warranty/last_vendor_challan_code**
- [ ] **out_of_warranty/list_vendor_challan**
- [ ] **out_of_warranty/create_vendor_challan**
- [ ] **out_of_warranty/vendor_challan_print**
- [ ] **out_of_warranty/enquiry{params}**
- [ ] **out_of_warranty/list_received_by**
- [ ] **out_of_warranty/vendor_not_settled**
- [ ] **out_of_warranty/update_vendor_unsettled**
- [ ] **out_of_warranty/list_of_final_vendor_settlement**
- [ ] **out_of_warranty/update_final_vendor_settlement**
- [ ] **out_of_warranty/srf_not_settled**
- [ ] **out_of_warranty/update_srf_unsettled**
- [ ] **out_of_warranty/list_of_final_srf_settlement**
- [ ] **out_of_warranty/update_final_srf_settlement**
- [ ] **out_of_warranty/show_receipt_names**
- [ ] **out_of_warranty/estimate_print**

### ServiceCharge Module
- [ ] **service_charge/service_charge**


---

## Application Development Progress

- [ ] **Authorization**
- [ ] **Database Schema**
- [ ] **Initial Deployment**
- [ ] **Backup**
- [ ] **Login & Menu**
- [ ] **User**
- [ ] **Master**
- [ ] **Retail**
- [ ] **Market**
- [ ] **Challan**
- [ ] **Warranty**
- [ ] **Out of Warranty**
- [ ] **Final Deployment**

---



