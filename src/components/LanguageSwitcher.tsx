import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    
    // Update document direction
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-5 h-5 text-gray-600" />
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          i18n.language === "ar"
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          i18n.language === "en"
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        English
      </button>
    </div>
  );
}
