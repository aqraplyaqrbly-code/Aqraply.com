import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Target,
  X,
  Save,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

interface Popup {
  _id: Id<"promotionalPopups">;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  ctaText: string;
  ctaTextAr?: string;
  ctaLink: string;
  imageUrl?: string;
  imageId?: Id<"_storage">;
  backgroundColor?: string;
  iconType?: "merchant-signup" | "giveaway" | "discount" | "custom";
  showOnce: boolean;
  showDaily: boolean;
  delay: number;
  targetPages?: string[];
  isActive: boolean;
  priority: number;
  rotationMode?: boolean;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
}

export default function PromotionalPopupsManager() {
  const popups = useQuery(api.promotionalPopups.getAllPopups) || [];
  const createPopup = useMutation(api.promotionalPopups.createPopup);
  const updatePopup = useMutation(api.promotionalPopups.updatePopup);
  const deletePopup = useMutation(api.promotionalPopups.deletePopup);
  const togglePopup = useMutation(api.promotionalPopups.togglePopup);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [showModal, setShowModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    ctaText: "",
    ctaTextAr: "",
    ctaLink: "",
    imageUrl: "",
    backgroundColor: "from-orange-500 to-red-600",
    iconType: "giveaway" as "merchant-signup" | "giveaway" | "discount" | "custom",
    showOnce: false,
    showDaily: false,
    delay: 2000,
    targetPages: [] as string[],
    isActive: true,
    priority: 1,
    rotationMode: false,
    startDate: "",
    endDate: "",
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await response.json();
      return storageId as Id<"_storage">;
    } catch (error) {
      toast.error("فشل رفع الصورة");
      console.error(error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageId: Id<"_storage"> | undefined = undefined;

      // Upload image if a new file is selected
      if (imageFile) {
        imageId = await handleImageUpload(imageFile);
        if (!imageId) {
          toast.error("فشل رفع الصورة، يرجى المحاولة مرة أخرى");
          return;
        }
      } else if (editingPopup && editingPopup.imageId) {
        // Keep existing imageId if no new file selected
        imageId = editingPopup.imageId;
      }

      const data = {
        ...formData,
        imageId,
        imageUrl: undefined, // We'll use imageId from storage
        rotationMode: formData.rotationMode,
        startDate: formData.startDate ? new Date(formData.startDate).getTime() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : undefined,
      };

      if (editingPopup) {
        await updatePopup({ id: editingPopup._id, ...data });
        toast.success("تم تحديث الإعلان بنجاح");
      } else {
        await createPopup(data);
        toast.success("تم إضافة الإعلان بنجاح");
      }

      setShowModal(false);
      setEditingPopup(null);
      setImageFile(null);
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعلان");
      console.error(error);
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      titleAr: popup.titleAr || "",
      description: popup.description,
      descriptionAr: popup.descriptionAr || "",
      ctaText: popup.ctaText,
      ctaTextAr: popup.ctaTextAr || "",
      ctaLink: popup.ctaLink,
      imageUrl: popup.imageUrl || "",
      backgroundColor: popup.backgroundColor || "from-orange-500 to-red-600",
      iconType: popup.iconType || "giveaway",
      showOnce: popup.showOnce,
      showDaily: popup.showDaily,
      delay: popup.delay,
      targetPages: popup.targetPages || [],
      isActive: popup.isActive,
      priority: popup.priority,
      rotationMode: popup.rotationMode || false,
      startDate: popup.startDate ? new Date(popup.startDate).toISOString().split('T')[0] : "",
      endDate: popup.endDate ? new Date(popup.endDate).toISOString().split('T')[0] : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: Id<"promotionalPopups">) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    try {
      await deletePopup({ id });
      toast.success("تم حذف الإعلان بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الإعلان");
    }
  };

  const handleToggle = async (id: Id<"promotionalPopups">) => {
    try {
      await togglePopup({ id });
      toast.success("تم تغيير حالة الإعلان");
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير حالة الإعلان");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      ctaText: "",
      ctaTextAr: "",
      ctaLink: "",
      imageUrl: "",
      backgroundColor: "from-orange-500 to-red-600",
      iconType: "giveaway",
      showOnce: false,
      showDaily: false,
      delay: 2000,
      targetPages: [],
      isActive: true,
      priority: 1,
      rotationMode: false,
      startDate: "",
      endDate: "",
    });
    setImageFile(null);
  };

  const addTargetPage = () => {
    const page = prompt("أدخل اسم الصفحة (مثال: /customer, /merchant, /)");
    if (page && !formData.targetPages.includes(page)) {
      setFormData({ ...formData, targetPages: [...formData.targetPages, page] });
    }
  };

  const removeTargetPage = (page: string) => {
    setFormData({
      ...formData,
      targetPages: formData.targetPages.filter((p) => p !== page),
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات المنبثقة</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingPopup(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة إعلان جديد
        </button>
      </div>

      {/* Popups List */}
      <div className="space-y-4">
        {popups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">لا توجد إعلانات حالياً</p>
          </div>
        ) : (
          popups.map((popup) => (
            <div
              key={popup._id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                popup.isActive ? "border-green-200 shadow-md" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{popup.title}</h3>
                    {popup.titleAr && (
                      <span className="text-sm text-gray-500">| {popup.titleAr}</span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        popup.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {popup.isActive ? "نشط" : "معطل"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{popup.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      التأخير: {popup.delay}ms
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {popup.showOnce ? "مرة واحدة" : popup.showDaily ? "يومياً" : "دائماً"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      الأولوية: {popup.priority}
                    </div>
                    {popup.rotationMode && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-purple-600 font-semibold">تناوب</span>
                      </div>
                    )}
                    {popup.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        من: {new Date(popup.startDate).toLocaleDateString("ar-EG")}
                      </div>
                    )}
                    {popup.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        إلى: {new Date(popup.endDate).toLocaleDateString("ar-EG")}
                      </div>
                    )}
                  </div>
                  {popup.targetPages && popup.targetPages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {popup.targetPages.map((page) => (
                        <span
                          key={page}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(popup._id)}
                    className={`p-2 rounded-lg transition-all ${
                      popup.isActive
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={popup.isActive ? "تعطيل" : "تفعيل"}
                  >
                    {popup.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(popup)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(popup._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPopup ? "تعديل الإعلان" : "إضافة إعلان جديد"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPopup(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان (عربي)
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف (إنجليزي) *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف (عربي)
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نص الزر (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نص الزر (عربي)
                  </label>
                  <input
                    type="text"
                    value={formData.ctaTextAr}
                    onChange={(e) => setFormData({ ...formData, ctaTextAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرابط *
                </label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="/customer, /merchant, /"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صورة الإعلان
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {uploadingImage && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      جاري رفع الصورة...
                    </div>
                  )}
                  {imageFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <ImageIcon className="w-4 h-4" />
                      {imageFile.name}
                    </div>
                  )}
                  {editingPopup && editingPopup.imageId && !imageFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      صورة موجودة (يمكنك استبدالها برفع صورة جديدة)
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الأيقونة
                </label>
                <select
                  value={formData.iconType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iconType: e.target.value as "merchant-signup" | "giveaway" | "discount" | "custom",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="giveaway">سحب جوائز</option>
                  <option value="merchant-signup">تسجيل تاجر</option>
                  <option value="discount">خصم</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الألوان (Gradient)
                </label>
                <select
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="from-orange-500 to-red-600">برتقالي - أحمر</option>
                  <option value="from-blue-500 to-purple-600">أزرق - بنفسجي</option>
                  <option value="from-green-500 to-teal-600">أخضر - تيل</option>
                  <option value="from-pink-500 to-rose-600">وردي</option>
                  <option value="from-yellow-500 to-orange-600">أصفر - برتقالي</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التأخير (مللي ثانية)
                  </label>
                  <input
                    type="number"
                    value={formData.delay}
                    onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الأولوية
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضع التناوب
                  </label>
                  <select
                    value={formData.rotationMode ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, rotationMode: e.target.value === "true" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="false">لا (إعلان واحد فقط)</option>
                    <option value="true">نعم (تناوب بين الإعلانات)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    عند التفعيل، سيتم عرض الإعلانات بالتناوب في كل زيارة
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حالة الإعلان
                  </label>
                  <select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="true">نشط</option>
                    <option value="false">معطل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مرة واحدة
                  </label>
                  <select
                    value={formData.showOnce ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, showOnce: e.target.value === "true" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="true">نعم</option>
                    <option value="false">لا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    يومياً
                  </label>
                  <select
                    value={formData.showDaily ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, showDaily: e.target.value === "true" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="true">نعم</option>
                    <option value="false">لا</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ البدء
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الصفحات المستهدفة
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.targetPages.map((page) => (
                    <span
                      key={page}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2"
                    >
                      {page}
                      <button
                        type="button"
                        onClick={() => removeTargetPage(page)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTargetPage}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  إضافة صفحة
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingPopup ? "حفظ التعديلات" : "إضافة الإعلان"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPopup(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
