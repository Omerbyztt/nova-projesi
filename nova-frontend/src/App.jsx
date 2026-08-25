import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './components/layout/AdminLayout';
import CompanyProfile from './pages/admin/CompanyProfile';
import DepartmentList from './pages/admin/DepartmentList';
import EmployeeList from './pages/admin/EmployeeList';
import TaskList from './pages/admin/TaskList';
import DashboardOverview from './pages/admin/DashboardOverview';

import EmployeeHome from './pages/employee/EmployeeHome';
import TaskBoard from './pages/employee/TaskBoard';
import Calendar from './pages/employee/Calendar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER', 'EMPLOYEE']} />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
          
          {/* Shared Layout wrapping all protected pages */}
          <Route element={<AdminLayout />}>
            
            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/company" element={<CompanyProfile />} />
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/employees" element={<EmployeeList />} />
            </Route>

            {/* Shared / Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER', 'EMPLOYEE']} />}>
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/home" element={<EmployeeHome />} />
              <Route path="/tasks-board" element={<TaskBoard />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>

          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;