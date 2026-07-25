import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import {
  Download,
  FileText,
  Users,
  Store,
  Package,
  ShoppingCart,
  Truck,
  Bell,
  Star,
  Wallet,
  Database,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ExportData {
  data: any[];
  count: number;
  exportedAt: number;
  type: string;
}

interface WalletData {
  wallets: any[];
  transactions: any[];
  walletsCount: number;
  transactionsCount: number;
  exportedAt: number;
  type: string;
}

interface AllData {
  summary: {
    users: number;
    stores: number;
    products: number;
    orders: number;
    captains: number;
    reviews: number;
    wallets: number;
    exportedAt: number;
    totalRecords: number;
  };
  data: {
    users: any[];
    stores: any[];
    products: any[];
    orders: any[];
    captains: any[];
    reviews: any[];
    wallets: any[];
  };
}

export default function AdminDataExport() {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<Array<{type: string, timestamp: number, count: number}>>([]);

  // Queries
  const usersData = useQuery(api.adminExport.exportUsers);
  const storesData = useQuery(api.adminExport.exportStores);
  const productsData = useQuery(api.adminExport.exportProducts);
  const ordersData = useQuery(api.adminExport.exportOrders);
  const captainsData = useQuery(api.adminExport.exportCaptains);
  const reviewsData = useQuery(api.adminExport.exportReviews);
  const walletsData = useQuery(api.adminExport.exportWallets);
  const allData = useQuery(api.adminExport.exportAllData);

  const exportTypes = [
    {
      id: 'users',
      name: 'المستخدمين',
      description: 'جميع المستخدمين والملفات الشخصية',
      icon: Users,
      color: 'blue',
      query: usersData
    },
    {
      id: 'stores',
      name: 'المتاجر',
      description: 'جميع المتاجر ومعلومات التاجر',
      icon: Store,
      color: 'purple',
      query: storesData
    },
    {
      id: 'products',
      name: 'المنتجات',
      description: 'جميع المنتجات والتفاصيل',
      icon: Package,
      color: 'green',
      query: productsData
    },
    {
      id: 'orders',
      name: 'الطلبات',
      description: 'جميع الطلبات والتفاصيل',
      icon: ShoppingCart,
      color: 'orange',
      query: ordersData
    },
    {
      id: 'captains',
      name: 'الكباتن',
      description: 'جميع الكباتن ومعلوماتهم',
      icon: Truck,
      color: 'red',
      query: captainsData
    },
        {
      id: 'reviews',
      name: 'المراجعات',
      description: 'جميع التقييمات والمراجعات',
      icon: Star,
      color: 'indigo',
      query: reviewsData
    },
    {
      id: 'wallets',
      name: 'المحافظ',
      description: 'المحافظ والمعاملات المالية',
      icon: Wallet,
      color: 'pink',
      query: walletsData
    }
  ];

  const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type: string, format: 'json' | 'csv') => {
    setExportingType(type);
    
    try {
      let data: ExportData | WalletData | AllData;
      let filename: string;

      switch (type) {
        case 'users':
          data = usersData!;
          filename = `users_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'stores':
          data = storesData!;
          filename = `stores_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'products':
          data = productsData!;
          filename = `products_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'orders':
          data = ordersData!;
          filename = `orders_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'captains':
          data = captainsData!;
          filename = `captains_export_${new Date().toISOString().split('T')[0]}`;
          break;
                case 'reviews':
          data = reviewsData!;
          filename = `reviews_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'wallets':
          data = walletsData!;
          filename = `wallets_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'all':
          data = allData!;
          filename = `all_data_export_${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          throw new Error('نوع تصدير غير صالح');
      }

      if (format === 'json') {
        downloadJSON(data, `${filename}.json`);
      } else {
        // For CSV, we need to handle different data structures
        if (type === 'wallets') {
          const walletData = data as WalletData;
          downloadCSV(walletData.wallets, `${filename}_wallets.csv`);
          downloadCSV(walletData.transactions, `${filename}_transactions.csv`);
        } else if (type === 'all') {
          const allDataExport = data as AllData;
          Object.entries(allDataExport.data).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              downloadCSV(value, `${filename}_${key}.csv`);
            }
          });
        } else {
          const exportData = data as ExportData;
          downloadCSV(exportData.data, `${filename}.csv`);
        }
      }

      // Add to export history
      setExportHistory(prev => [...prev, {
        type,
        timestamp: Date.now(),
        count: type === 'all' ? (data as AllData).summary.totalRecords : 
               type === 'wallets' ? (data as WalletData).walletsCount + (data as WalletData).transactionsCount :
               (data as ExportData).count
      }]);

      toast.success(`تم تصدير ${type === 'all' ? 'جميع البيانات' : exportTypes.find(t => t.id === type)?.name} بنجاح`);
    } catch (error) {
      toast.error('فشل في تصدير البيانات');
      console.error('Export error:', error);
    } finally {
      setExportingType(null);
    }
  };

  const getRecordCount = (type: string) => {
    switch (type) {
      case 'users': return usersData?.count || 0;
      case 'stores': return storesData?.count || 0;
      case 'products': return productsData?.count || 0;
      case 'orders': return ordersData?.count || 0;
      case 'captains': return captainsData?.count || 0;
      case 'reviews': return reviewsData?.count || 0;
      case 'wallets': return (walletsData?.walletsCount || 0) + (walletsData?.transactionsCount || 0);
      case 'all': return allData?.summary.totalRecords || 0;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تصدير البيانات</h1>
                <p className="text-gray-600">تصدير جميع بيانات النظام بصيغ مختلفة</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">المستخدمين</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{getRecordCount('users')}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">المتاجر</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">{getRecordCount('stores')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">المنتجات</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{getRecordCount('products')}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">الطلبات</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-1">{getRecordCount('orders')}</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {exportTypes.map((type) => {
            const Icon = type.icon;
            const count = getRecordCount(type.id);
            const isLoading = exportingType === type.id;
            const queryData = type.query;

            return (
              <div key={type.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${type.color}-100 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${type.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                    <p className="text-xs text-gray-500">سجل</p>
                  </div>
                </div>

                {queryData === undefined ? (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">جاري التحميل...</span>
                  </div>
                ) : queryData === null ? (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">خطأ في تحميل البيانات</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport(type.id, 'json')}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isLoading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      JSON
                    </button>
                    <button
                      onClick={() => handleExport(type.id, 'csv')}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isLoading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      CSV
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Export All Data */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-sm p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">تصدير جميع البيانات</h2>
              <p className="text-purple-100">تصدير جميع بيانات النظام في ملف واحد</p>
              <p className="text-sm text-purple-200 mt-1">
                إجمالي السجلات: {getRecordCount('all')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('all', 'json')}
                disabled={exportingType === 'all'}
                className={`flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors ${
                  exportingType === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {exportingType === 'all' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                تصدير JSON
              </button>
              <button
                onClick={() => handleExport('all', 'csv')}
                disabled={exportingType === 'all'}
                className={`flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors ${
                  exportingType === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {exportingType === 'all' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                تصدير CSV
              </button>
            </div>
          </div>
        </div>

        {/* Export History */}
        {exportHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل التصدير</h2>
            <div className="space-y-2">
              {exportHistory.slice(-5).reverse().map((exportItem, index) => {
                const typeInfo = exportTypes.find(t => t.id === exportItem.type);
                const Icon = typeInfo?.icon || FileText;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {typeInfo?.name || exportItem.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(exportItem.timestamp).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{exportItem.count} سجل</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
