import ShowAllUsersPage from "./pages/ShowAllUsersPage.jsx";
import DeleteUserPage from "./pages/UserDeletePage.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuDashboardPage from "./pages/MenuDashboardPage.jsx";
import PageNotAvailable from "./pages/PageNotAvailable";
import PageNotFound from "./pages/PageNotFound";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import ShowStandardUsersPage from "./pages/ShowStandardUsersPage.jsx";
import CreateUserPage from "./pages/UserCreatePage.jsx";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import MasterCreatePage from "./pages/MasterCreatePage.jsx";
import MasterUpdatePage from "./pages/MasterUpdatePage.jsx";

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
            path="/not-available"
            element={
              <PrivateRoute>
                <PageNotAvailable />
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
            path="/customer/create"
            element={
              <PrivateRoute>
                <MasterCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/update"
            element={
              <PrivateRoute>
                <MasterUpdatePage />
              </PrivateRoute>
            }
          />
          <Route path="/*" element={
            <PrivateRoute>
              <PageNotFound />
            </PrivateRoute>
          } />
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
