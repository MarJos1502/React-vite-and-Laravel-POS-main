import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Transactions from "./pages/Transaction";
import Dashboard from "./pages/Dashboard";
import FeedbackAnalytics from "./pages/FeedbackAnalytics";
import Reports from "./pages/Reports";
import Survey from "./pages/Survey";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import UserManagement from "./pages/UserManagement";
import FarewellMessages from "./pages/FarewellMessages";
import Navigation from './components/Navigation';
import { routes } from './config/routes';
import './styles/main.css';
import { useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AppRoutes() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Logout handler that logs out and redirects to login
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route
          path={routes.products.path}
          element={
            <ProtectedRoute allowedRoles={routes.products.allowedRoles}>
              <Products />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={routes.transactions.path}
          element={
            <ProtectedRoute allowedRoles={routes.transactions.allowedRoles}>
              <Transactions />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={routes.dashboard.path}
          element={
            <ProtectedRoute allowedRoles={routes.dashboard.allowedRoles}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={routes.feedback.path}
          element={
            <ProtectedRoute allowedRoles={routes.feedback.allowedRoles}>
              <FeedbackAnalytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={routes.reports.path}
          element={
            <ProtectedRoute allowedRoles={routes.reports.allowedRoles}>
              <Reports />
            </ProtectedRoute>
          }
        />
        
        <Route
          path={routes.survey.path}
          element={
            <ProtectedRoute allowedRoles={routes.survey.allowedRoles}>
              <Survey />
            </ProtectedRoute>
          }
        />
        {user?.role === "administrator" && (
          <>
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["administrator"]}>
                  <UserManagement setLoading={() => {}} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farewell-messages"
              element={
                <ProtectedRoute allowedRoles={["administrator"]}>
                  <FarewellMessages setLoading={() => {}} />
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize Bootstrap tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(popoverTriggerEl => new window.bootstrap.Popover(popoverTriggerEl));
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-vh-100 bg-light">
          <Navigation />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
