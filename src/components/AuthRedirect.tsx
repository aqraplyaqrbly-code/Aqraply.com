import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextNew';

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (user?.profile) {
      switch (user.profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        case 'captain':
          navigate('/captain');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحويلك...</p>
      </div>
    </div>
  );
}
