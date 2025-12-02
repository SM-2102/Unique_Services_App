import ShowAllUsersPage from "./pages/ShowAllUsersPage.jsx";
import DeleteUserPage from "./pages/UserDeletePage.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuDashboardPage from "./pages/MenuDashboardPage.jsx";
import PageNotFound from "./pages/PageNotFound";
import PageNotAvailable from "./pages/PageNotAvailable.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import ShowStandardUsersPage from "./pages/ShowStandardUsersPage.jsx";
import CreateUserPage from "./pages/UserCreatePage.jsx";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DashboardDataProvider } from "./context/DashboardDataContext.jsx";
import MasterCreatePage from "./pages/MasterCreatePage.jsx";
import MasterUpdatePage from "./pages/MasterUpdatePage.jsx";
import RoadChallanPrintPage from "./pages/RoadChallanPrintPage.jsx";
import RoadChallanCreatePage from "./pages/RoadChallanCreatePage.jsx";
import MarketCreatePage from "./pages/MarketCreatePage.jsx";
import MarketUpdatePage from "./pages/MarketUpdatePage.jsx";
import MarketEnquiryPage from "./pages/MarketEnquiryPage.jsx";
import RetailSettleAdminPage from "./pages/RetailSettleAdminPage.jsx";
import RetailCreatePage from "./pages/RetailCreatePage.jsx";
import RetailEnquiryPage from "./pages/RetailEnquiryPage.jsx";
import RetailUpdatePage from "./pages/RetailUpdatePage.jsx";
import RetailSettleUserPage from "./pages/RetailSettleUserPage.jsx";
import RetailPrintPage from "./pages/RetailPrintPage.jsx";
import WarrantyCreatePage from "./pages/WarrantyCreatePage.jsx";
import WarrantySRFPrintPage from "./pages/WarrantySRFPrintPage.jsx";
import WarrantyCreateCNFPage from "./pages/WarrantyCreateCNFPage.jsx";
import WarrantyCNFPrintPage from "./pages/WarrantyCNFPrintPage.jsx";
import WarrantyUpdatePage from "./pages/WarrantyUpdatePage.jsx";
import WarrantyEnquiryPage from "./pages/WarrantyEnquiryPage.jsx";

function AppRoutesWithNav() {
  return (
    <>
      <Header />
      <div className="pt-[5.5rem] pb-[1.5rem] min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <PageNotFound />
              </PrivateRoute>
            }
          />
          <Route
            path="/MenuDashboard"
            element={
              <PrivateRoute>
                <MenuDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateUser"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <CreateUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/DeleteUser"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <DeleteUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ChangePassword"
            element={
              <PrivateRoute>
                <ChangePasswordPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ShowAllUsers"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <ShowAllUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ShowStandardUsers"
            element={
              <PrivateRoute>
                <ShowStandardUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateCustomerRecord"
            element={
              <PrivateRoute>
                <MasterCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateCustomerRecord"
            element={
              <PrivateRoute>
                <MasterUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateRoadChallan"
            element={
              <PrivateRoute>
                <RoadChallanCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintRoadChallan"
            element={
              <PrivateRoute>
                <RoadChallanPrintPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateMarketRecord"
            element={
              <PrivateRoute>
                <MarketCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateMarketRecord"
            element={
              <PrivateRoute>
                <MarketUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/MarketRecordEnquiry"
            element={
              <PrivateRoute>
                <MarketEnquiryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateRetailRecord"
            element={
              <PrivateRoute>
                <RetailCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateRetailRecord"
            element={
              <PrivateRoute>
                <RetailUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintRetailReceipt"
            element={
              <PrivateRoute>
                <RetailPrintPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ProposeToSettleRetailRecord"
            element={
              <PrivateRoute>
                <RetailSettleUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/FinalSettlementRetailRecord"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <RetailSettleAdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/RetailRecordEnquiry"
            element={
              <PrivateRoute>
                <RetailEnquiryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateWarrantySRF"
            element={
              <PrivateRoute>
                <WarrantyCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateWarrantyCNFChallan"
            element={
              <PrivateRoute>
                <WarrantyCreateCNFPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintWarrantySRF"
            element={
              <PrivateRoute>
                <WarrantySRFPrintPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintWarrantyCNFChallan"
            element={
              <PrivateRoute>
                <WarrantyCNFPrintPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateWarrantySRF"
            element={
              <PrivateRoute>
                <WarrantyUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/WarrantyEnquiry"
            element={
              <PrivateRoute>
                <WarrantyEnquiryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateOutOfWarrantySRF"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintOutOfWarrantySRF"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/UpdateOutOfWarrantySRF"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/ProposeToSettleOutOfWarrantySRF"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/CreateOutOfWarrantyVendorChallan"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintOutOfWarrantyVendorChallan"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/PrintOutOfWarrantyEstimate"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/FinalSettlementOutOfWarrantyVendor"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/OutOfWarrantyEnquiry"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/FinalSettlementOutOfWarrantySRF"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/ProposeToSettleOutOfWarrantyVendor"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DashboardDataProvider>
        <AuthProvider>
          <AppRoutesWithNav />
        </AuthProvider>
      </DashboardDataProvider>
    </BrowserRouter>
  );
}

export default App;
