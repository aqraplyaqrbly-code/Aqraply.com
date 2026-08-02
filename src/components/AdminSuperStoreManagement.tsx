import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContextNew';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Power,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Key
} from 'lucide-react';

interface StoreWithDetails {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  address: string;
  phone: string;
  imageUrl?: string;
  isActive: boolean;
  estimatedDeliveryTime: number;
  commissionRate: number;
  createdAt: number;
  owner?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    isSuspended: boolean;
  };
  products?: Array<{
    _id: string;
    nameAr: string;
    price: number;
    quantity: number;
    isActive: boolean;
    isAvailable: boolean;
    images: string[];
  }>;
}

export default function AdminSuperStoreManagement() {
  const { t } = useTranslation();
  const [selectedStore, setSelectedStore] = useState<StoreWithDetails | null>(null);
  const [editingStore, setEditingStore] = useState<StoreWithDetails | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage] = useState(10);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const { sessionToken, isAuthenticated } = useAuth();

  // Queries
  const allStores = useQuery(api.permissions.getAllStoresAsAdmin, isAuthenticated && sessionToken ? { sessionToken } : "skip");
  const updateStore = useMutation(api.permissions.updateAnyStoreAsAdmin);
  const updateProduct = useMutation(api.permissions.updateAnyProductAsAdmin);
  const deleteProduct = useMutation(api.permissions.deleteAnyProductAsAdmin);
  const updateMerchant = useMutation(api.permissions.updateAnyMerchantAsAdmin);
  const toggleProductVisibility = useMutation(api.permissions.toggleProductVisibilityAsAdmin);
  const toggleStoreStatus = useMutation(api.permissions.toggleStoreStatusAsAdmin);

  // جلب بيانات المتاجر مع التفاصيل
  const storesWithDetails: StoreWithDetails[] = React.useMemo(() => {
    if (!allStores) return [];
    
    return allStores.map(store => ({
      ...store,
      owner: undefined, // سيتم جلبها عند الحاجة
      products: [] // سيتم جلبها عند الحاجة
    }));
  }, [allStores]);

  // فلترة المتاجر
  const filteredStores = React.useMemo(() => {
    let filtered = storesWithDetails;
    
    if (searchQuery) {
      filtered = filtered.filter(store => 
        store.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(store => 
        filterStatus === 'active' ? store.isActive : !store.isActive
      );
    }
    
    return filtered;
  }, [storesWithDetails, searchQuery, filterStatus]);

  const handleStoreSelect = async (store: StoreWithDetails) => {
    setSelectedStore(store);
    setIsLoading(true);
    
    try {
      // جلب منتجات المتجر
      // سيتم إضافة هذه الدالة لاحقاً
    } catch (error) {
      toast.error(t('errors.failedToFetchStoreData'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreUpdate = async (storeId: string, updates: any) => {
    try {
      console.log('Updating store:', { storeId, updates });
      await updateStore({ sessionToken, storeId, updates });
      toast.success(t('errors.storeUpdatedSuper'));
      setEditingStore(null);
    } catch (error) {
      console.error('Store update error:', error);
      toast.error(error instanceof Error ? error.message : t('errors.failedToUpdateStoreSuper'));
    }
  };

  const handleProductUpdate = async (productId: string, updates: any) => {
    try {
      await updateProduct({ productId, updates });
      toast.success(t('errors.productUpdatedSuper'));
      setEditingProduct(null);
    } catch (error) {
      toast.error(t('errors.failedToUpdateProductSuper'));
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (!confirm(t('errors.deleteProductConfirm'))) return;
    
    try {
      await deleteProduct({ sessionToken, productId });
      toast.success(t('errors.productDeletedSuper'));
    } catch (error) {
      toast.error(t('errors.failedToDeleteProductSuper'));
    }
  };

  const handleToggleProductVisibility = async (productId: string, isVisible: boolean) => {
    try {
      await toggleProductVisibility({ sessionToken, productId, isVisible });
      toast.success(t('errors.productShownSuper'));
    } catch (error) {
      toast.error(t('errors.failedToUpdateProductStatusSuper'));
    }
  };

  const handleToggleStoreStatus = async (storeId: string, isActive: boolean) => {
    try {
      await toggleStoreStatus({ sessionToken, storeId, isActive });
      toast.success(t('errors.storeActivatedSuper'));
    } catch (error) {
      toast.error(t('errors.failedToUpdateStoreStatusSuper'));
    }
  };

  const handlePasswordReset = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    setShowPasswordReset(true);
  };

  const executePasswordReset = async () => {
    if (!selectedMerchantId || !newPassword) {
      toast.error(t('errors.enterNewPasswordSuper'));
      return;
    }

    try {
      // سنحتاج إلى إنشاء mutation خاص لتغيير الباسورد
      console.log('Password reset for:', selectedMerchantId);
      toast.success(t('errors.passwordChangedSuper'));
      setShowPasswordReset(false);
      setNewPassword('');
      setSelectedMerchantId(null);
    } catch (error) {
      toast.error(t('errors.failedToChangePasswordSuper'));
    }
  };

  // حساب المتاجر المعروضة في الصفحة الحالية
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('errors.superStoreManagement')}</h1>
                <p className="text-gray-600">{t('errors.fullPermissions')}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t('errors.refreshSuper')}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('errors.searchStore')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('errors.allSuper')}
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('errors.activeSuper')}
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'inactive' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('errors.inactiveSuper')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stores List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{t('errors.storesCount', { count: filteredStores.length })}</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {currentStores.map((store) => (
                  <div
                    key={store._id}
                    onClick={() => handleStoreSelect(store)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedStore?._id === store._id 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{store.nameAr}</h3>
                        <p className="text-sm text-gray-600">{store.address}</p>
                        {store.owner?.email && (
                          <p className="text-sm text-blue-600 mt-1">{store.owner.email}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            store.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {store.isActive ? t('errors.activeSuper') : t('errors.inactiveSuper')}
                          </span>
                        </div>
                      </div>
                      {store.imageUrl && (
                        <img
                          src={store.imageUrl}
                          alt={store.nameAr}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="lg:col-span-2">
            {selectedStore ? (
              <div className="space-y-6">
                {/* Store Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{t('errors.storeInfoSuper')}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStore(selectedStore)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        {t('errors.editProduct')}
                      </button>
                      <button
                        onClick={() => handleToggleStoreStatus(selectedStore._id, !selectedStore.isActive)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          selectedStore.isActive 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        <Power className="w-4 h-4" />
                        {selectedStore.isActive ? t('errors.disableSuper') : t('errors.activateSuper')}
                      </button>
                    </div>
                  </div>

                  {editingStore?._id === selectedStore._id ? (
                    <StoreEditForm
                      store={editingStore}
                      onSave={handleStoreUpdate}
                      onCancel={() => setEditingStore(null)}
                    />
                  ) : (
                    <StoreInfoDisplay 
                      store={selectedStore} 
                      onPasswordReset={setSelectedMerchantId}
                    />
                  )}
                </div>

                {/* Products */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{t('errors.productsList')}</h2>
                    <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      {t('errors.addProduct')}
                    </button>
                  </div>

                  {selectedStore.products && selectedStore.products.length > 0 ? (
                    <div className="space-y-4">
                      {selectedStore.products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onEdit={setEditingProduct}
                          onDelete={handleProductDelete}
                          onToggleVisibility={handleToggleProductVisibility}
                          onUpdate={handleProductUpdate}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{t('errors.noProductsInStore')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('errors.selectStoreSuper')}</h3>
                <p className="text-gray-600">{t('errors.selectStoreFromList')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Password Reset Modal */}
        <PasswordResetModal
          isOpen={showPasswordReset}
          onClose={() => {
            setShowPasswordReset(false);
            setNewPassword('');
            setSelectedMerchantId(null);
          }}
          onReset={executePasswordReset}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
        />
      </div>
    </div>
  );
}

// مكون عرض معلومات المتجر
function StoreInfoDisplay({ store, onPasswordReset }: { 
  store: StoreWithDetails; 
  onPasswordReset: (merchantId: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.nameArabicSuper')}</label>
          <p className="text-gray-900">{store.nameAr}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.nameEnglishSuper')}</label>
          <p className="text-gray-900">{store.nameEn}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.addressSuper')}</label>
          <p className="text-gray-900">{store.address}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.phoneSuper')}</label>
          <p className="text-gray-900">{store.phone}</p>
        </div>
        {store.owner?.email && (
          <div>
            <label className="text-sm font-medium text-gray-500">{t('errors.emailSuper')}</label>
            <p className="text-gray-900">{store.owner.email}</p>
          </div>
        )}
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.deliveryTime')}</label>
          <p className="text-gray-900">{store.estimatedDeliveryTime} {t('errors.minuteSuper')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.merchantCommission')}</label>
          <p className="text-gray-900">{store.commissionRate}%</p>
        </div>
      </div>

      {/* أزرار التحكم */}
      {store.owner && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onPasswordReset(store.owner!._id)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Key className="w-4 h-4" />
            {t('errors.changePasswordSuper')}
          </button>
        </div>
      )}
      
      <div>
        <label className="text-sm font-medium text-gray-500">{t('errors.descriptionArabicSuper')}</label>
        <p className="text-gray-900">{store.descriptionAr}</p>
      </div>
      
      {store.imageUrl && (
        <div>
          <label className="text-sm font-medium text-gray-500">{t('errors.storeImage')}</label>
          <img
            src={store.imageUrl}
            alt={store.nameAr}
            className="mt-2 w-32 h-32 rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
}

// مكون تعديل المتجر
function StoreEditForm({ store, onSave, onCancel }: {
  store: StoreWithDetails;
  onSave: (id: string, data: any) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nameAr: store.nameAr,
    nameEn: store.nameEn,
    descriptionAr: store.descriptionAr,
    descriptionEn: store.descriptionEn,
    address: store.address,
    phone: store.phone,
    estimatedDeliveryTime: store.estimatedDeliveryTime,
    commissionRate: store.commissionRate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(store._id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.nameArabicSuper')}</label>
          <input
            type="text"
            value={formData.nameAr}
            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.nameEnglishSuper')}</label>
          <input
            type="text"
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.addressSuper')}</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.phoneSuper')}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.deliveryTimeMinutes')}</label>
          <input
            type="number"
            value={formData.estimatedDeliveryTime}
            onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.merchantCommissionPercent')}</label>
          <input
            type="number"
            step="0.1"
            value={formData.commissionRate}
            onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.descriptionArabicSuper')}</label>
        <textarea
          value={formData.descriptionAr}
          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('errors.descriptionEnglishSuper')}</label>
        <textarea
          value={formData.descriptionEn}
          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          {t('errors.saveSuper')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          {t('errors.cancel')}
        </button>
      </div>
    </form>
  );
}

// مكون بطاقة المنتج
function ProductCard({ product, onEdit, onDelete, onToggleVisibility, onUpdate }: {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onUpdate: (id: string, data: any) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.nameAr}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{product.nameAr}</h4>
              <p className="text-sm text-gray-600">{product.price} ج.م</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.isActive && product.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.isActive && product.isAvailable ? t('errors.availableSuper') : t('errors.unavailableSuper')}
                </span>
                <span className="text-xs text-gray-500">
                  {t('errors.quantitySuper')}: {product.quantity}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onToggleVisibility(product._id, !(product.isActive && product.isAvailable))}
            className={`p-2 rounded-lg transition-colors ${
              product.isActive && product.isAvailable
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            title={product.isActive && product.isAvailable ? t('errors.hideSuper') : t('errors.showSuper')}
          >
            {product.isActive && product.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title={t('errors.editProduct')}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            title={t('errors.deleteSuper')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal لتغيير كلمة المرور
function PasswordResetModal({ 
  isOpen, 
  onClose, 
  onReset, 
  newPassword, 
  setNewPassword 
}: {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('errors.changePasswordSuper')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('errors.newPasswordSuper')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={t('errors.enterNewPasswordPlaceholder')}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('errors.changeSuper')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t('errors.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

// مكون تحكم الصفحات
function PaginationControls({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {t('errors.previous')}
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {t('errors.next')}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{t('errors.pageSuper')} {currentPage} {t('errors.fromTotalStores', { total: totalPages })}</span>
      </div>
    </div>
  );
}
