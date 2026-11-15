import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import './index.css';

function MainLayout() {
  const [currentView, setCurrentView] = useState(() => {
    // Check initial pathname on browser load
    const path = window.location.pathname;
    if (path === '/admin/dashboard' || path === '/admin') return '/admin/dashboard';
    if (path === '/dashboard') return '/dashboard';
    if (path === '/my-bookings') return '/my-bookings';
    if (path === '/profile') return '/profile';
    if (path === '/login') return '/login';
    if (path === '/register') return '/register';
    return '/';
  });

  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  // Helper for view navigation with browser URL pushState
  const navigate = (view) => {
    setCurrentView(view);
    try {
      const urlPath = view.startsWith('/') ? view : `/${view}`;
      window.history.pushState({}, '', urlPath === '/landing' ? '/' : urlPath);
    } catch (e) {}
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin/dashboard' || path === '/admin') setCurrentView('/admin/dashboard');
      else if (path === '/dashboard') setCurrentView('/dashboard');
      else if (path === '/my-bookings') setCurrentView('/my-bookings');
      else if (path === '/profile') setCurrentView('/profile');
      else if (path === '/login') setCurrentView('/login');
      else if (path === '/register') setCurrentView('/register');
      else setCurrentView('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return <div className="loading-state">Initializing PARKIFY...</div>;
  }

  return (
    <div className="app-shell">
      <Navbar currentView={currentView} setCurrentView={navigate} />

      <main className="main-viewport">
        {/* Public Landing View */}
        {(currentView === '/' || currentView === 'landing') && (
          <LandingPage setCurrentView={navigate} />
        )}

        {/* User Dashboard: Find & Reserve Bays */}
        {(currentView === '/dashboard' || currentView === 'dashboard') && (
          <DashboardPage setCurrentView={navigate} />
        )}

        {/* Login Page */}
        {(currentView === '/login' || currentView === 'login') && (
          <LoginPage setCurrentView={navigate} />
        )}

        {/* Register Page */}
        {(currentView === '/register' || currentView === 'register') && (
          <RegisterPage setCurrentView={navigate} />
        )}

        {/* User Bookings Page */}
        {(currentView === '/my-bookings' || currentView === 'my-bookings') && (
          isAuthenticated ? (
            <MyBookingsPage setCurrentView={navigate} />
          ) : (
            <LoginPage setCurrentView={navigate} />
          )
        )}

        {/* Admin Dashboard: Strictly Protected by Role-Based Access Control */}
        {(currentView === '/admin/dashboard' || currentView === '/admin' || currentView === 'admin') && (
          !isAuthenticated ? (
            <LoginPage setCurrentView={navigate} />
          ) : !isAdmin ? (
            // User is authenticated but NOT an admin -> HTTP 403 Forbidden Page
            <UnauthorizedPage setCurrentView={navigate} />
          ) : (
            // User is authenticated and HAS admin role
            <AdminDashboardPage setCurrentView={navigate} />
          )
        )}

        {/* User Profile Page */}
        {(currentView === '/profile' || currentView === 'profile') && (
          isAuthenticated ? (
            <ProfilePage setCurrentView={navigate} />
          ) : (
            <LoginPage setCurrentView={navigate} />
          )
        )}

        {/* Explicit Unauthorized View */}
        {currentView === '/unauthorized' && (
          <UnauthorizedPage setCurrentView={navigate} />
        )}
      </main>

      <Footer setCurrentView={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </AuthProvider>
  );
}
