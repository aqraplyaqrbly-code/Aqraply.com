import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  t?: (key: string) => string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Dashboard Error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Show toast notification for admin errors
    const errorMessage = this.props.t ? this.props.t('errors.adminDashboardError') : 'حدث خطأ في لوحة الإدارة';
    toast.error(errorMessage, {
      duration: 5000,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const t = this.props.t || ((key: string) => key);

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('errors.adminDashboardError')}</h1>
            <p className="text-gray-600 mb-8">
              {t('errors.adminDashboardErrorDesc')}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t('errors.reloadPage')}
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                {t('errors.goToHomePage')}
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => {
                    const details = document.getElementById('error-details');
                    if (details) {
                      details.classList.toggle('hidden');
                    }
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {t('errors.showErrorDetails')}
                </button>
                
                <div id="error-details" className="hidden mt-3">
                  <details className="text-right">
                    <summary className="text-sm text-gray-500 cursor-pointer">{t('errors.technicalErrorDetails')}</summary>
                    <div className="mt-2 space-y-2">
                      <div className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                        <strong>{t('errors.error')}:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.error.message}</pre>
                      </div>
                      {this.state.errorInfo && (
                        <div className="text-xs text-orange-600 bg-orange-50 p-3 rounded overflow-auto">
                          <strong>{t('errors.additionalInfo')}:</strong>
                          <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* Contact support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {t('errors.contactSupport')}
              </p>
              <div className="mt-2 flex justify-center gap-4 text-sm">
                <a href="mailto:support@aqraply.com" className="text-purple-600 hover:text-purple-700">
                  support@aqraply.com
                </a>
                <span className="text-gray-400">|</span>
                <a href="tel:+201234567890" className="text-purple-600 hover:text-purple-700">
                  +201234567890
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper component
export function AdminErrorBoundaryWrapper({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { t } = useTranslation();
  return <AdminErrorBoundary t={t} fallback={fallback}>{children}</AdminErrorBoundary>;
}
