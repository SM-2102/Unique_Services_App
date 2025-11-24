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
import MasterCreatePage from "./pages/MasterCreatePage.jsx";
import MasterUpdatePage from "./pages/MasterUpdatePage.jsx";
import RoadChallanPrintPage from "./pages/RoadChallanPrintPage.jsx";
import RoadChallanCreatePage from "./pages/RoadChallanCreatePage.jsx";
import MarketCreatePage from "./pages/MarketCreatePage.jsx";
import MarketUpdatePage from "./pages/MarketUpdatePage.jsx";

function AppRoutesWithNav() {
  return (
    <>
      <Header />
      <div className="pt-[5.5rem] pb-[1.5rem] min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MenuDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <CreateUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/delete-user"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <DeleteUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePasswordPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/show-users"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <ShowAllUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/show-standard-users"
            element={
              <PrivateRoute>
                <ShowStandardUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-create"
            element={
              <PrivateRoute>
                <MasterCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-update"
            element={
              <PrivateRoute>
                <MasterUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <PageNotFound />
              </PrivateRoute>
            }
          />
          <Route
            path="/challan-create"
            element={
              <PrivateRoute>
                <RoadChallanCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/challan-print"
            element={
              <PrivateRoute>
                <RoadChallanPrintPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-create_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-create_cnf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-print_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-print_cnf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-update_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/warranty-enquiry"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-create_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-print_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-update_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-settle_srf"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-create_vendor_challan"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-print_vendor_challan"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-print_estimate"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-settle_vendor"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/oow-enquiry"
            element={
              <PrivateRoute>
                <PageNotAvailable />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-create"
            element={
              <PrivateRoute>
                <MarketCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-update"
            element={
              <PrivateRoute>
                <MarketUpdatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-enquiry"
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
      <AuthProvider>
        <AppRoutesWithNav />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
