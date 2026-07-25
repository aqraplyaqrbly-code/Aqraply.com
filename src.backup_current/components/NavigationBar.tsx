import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  LogOut,
  Settings,
  Store,
  Truck,
  ShoppingBag,
  Crown,
  Home
} from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'react-hot-toast';

export function NavigationBar() {
  const { user, role, isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'merchant': return <Store className="w-4 h-4" />;
      case 'captain': return <Truck className="w-4 h-4" />;
      case 'customer': return <ShoppingBag className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleName = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'مدير';
      case 'merchant': return 'تاجر';
      case 'captain': return 'كابتن';
      case 'customer': return 'عميل';
      default: return 'مستخدم';
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'bg-purple-500';
      case 'merchant': return 'bg-orange-500';
      case 'captain': return 'bg-blue-500';
      case 'customer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* الشعار والصفحة الرئيسية */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-900 hover:text-orange-600 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="font-bold text-lg">أقربلي</span>
            </Link>
          </div>

          {/* معلومات المستخدم والإعدادات */}
          <div className="flex items-center space-x-4">
            {/* معلومات الدور */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full ${getRoleColor(role || '')} flex items-center justify-center text-white`}>
                {getRoleIcon(role || '')}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.profile?.fullName || 'مستخدم'}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleName(role || '')}
                </p>
              </div>
            </div>

            {/* قائمة التنقل حسب الدور */}
            <div className="flex items-center space-x-2">
              {role === 'customer' && (
                <Link
                  to="/customer"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  المتاجر
                </Link>
              )}

              {role === 'merchant' && (
                <Link
                  to="/merchant"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  لوحة التحكم
                </Link>
              )}

              {role === 'captain' && (
                <Link
                  to="/captain"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  الطلبات
                </Link>
              )}

              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  لوحة الإدارة
                </Link>
              )}
            </div>

            {/* قائمة الإعدادات */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* القائمة المنسدلة */}
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.profile?.fullName || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}