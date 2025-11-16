import ShowUsersPage from "./pages/ShowUsersPage";
import DeleteUserPage from "./pages/DeleteUserPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuDashboard from "./pages/MenuDashboard";
import PageNotAvailable from "./pages/PageNotAvailable";
import PageNotFound from "./pages/PageNotFound";


import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import CreateUserPage from "./pages/CreateUserPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="pt-[5.5rem] pb-[1.5rem] min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MenuDashboard />
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
                  <ShowUsersPage />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
