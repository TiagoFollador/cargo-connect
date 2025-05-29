import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import DashboardActivePage from './pages/DashboardActivePage';
import DashboardPendingPage from './pages/DashboardPendingPage';
import DashboardHistoryPage from './pages/DashboardHistoryPage';
import DashboardSettingsPage from './pages/DashboardSettingsPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'active',
        element: <DashboardActivePage />,
      },
      {
        path: 'pending',
        element: <DashboardPendingPage />,
      },
      {
        path: 'history',
        element: <DashboardHistoryPage />,
      },
      {
        path: 'settings',
        element: <DashboardSettingsPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;