import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import CompanyProfile from './pages/admin/CompanyProfile';
import DepartmentList from './pages/admin/DepartmentList';
import EmployeeList from './pages/admin/EmployeeList';
import TaskList from './pages/admin/TaskList';
import DashboardOverview from './pages/admin/DashboardOverview';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Layout wrapping all admin pages */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/company" element={<CompanyProfile />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/tasks" element={<TaskList />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;