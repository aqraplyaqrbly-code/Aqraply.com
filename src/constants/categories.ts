export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon?: string;
}

export interface MainCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon?: string;
  subcategories: Category[];
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: "todays_offers",
    nameAr: "عروض اليوم",
    nameEn: "Today's Offers",
    icon: "🔥",
    subcategories: [],
  },
  {
    id: "supermarket_food",
    nameAr: "سوبرماركت وأغذية",
    nameEn: "Supermarket & Food",
    icon: "🛒",
    subcategories: [
      { id: "vegetables_fruits", nameAr: "خضار وفاكهة", nameEn: "Vegetables & Fruits" },
      { id: "bakeries", nameAr: "مخابز", nameEn: "Bakeries" },
      { id: "sweets", nameAr: "حلويات", nameEn: "Sweets" },
      { id: "butcher", nameAr: "جزارة", nameEn: "Butcher" },
      { id: "supermarket", nameAr: "سوبر ماركت", nameEn: "Supermarket" },
    ],
  },
  {
    id: "restaurants_cafes",
    nameAr: "مطاعم وكافيهات",
    nameEn: "Restaurants & Cafes",
    icon: "🍽️",
    subcategories: [
      { id: "restaurants", nameAr: "مطاعم", nameEn: "Restaurants" },
      { id: "cafes", nameAr: "كافيهات", nameEn: "Cafes" },
    ],
  },
  {
    id: "electronics_devices",
    nameAr: "إلكترونيات وأجهزة",
    nameEn: "Electronics & Devices",
    icon: "📱",
    subcategories: [
      { id: "home_appliances", nameAr: "أجهزة منزلية", nameEn: "Home Appliances" },
      { id: "electronics", nameAr: "إلكترونيات", nameEn: "Electronics" },
      { id: "mobiles", nameAr: "موبايلات", nameEn: "Mobiles" },
      { id: "computers_laptops", nameAr: "كمبيوتر ولابتوب", nameEn: "Computers & Laptops" },
    ],
  },
  {
    id: "fashion_beauty",
    nameAr: "موضة وجمال",
    nameEn: "Fashion & Beauty",
    icon: "👗",
    subcategories: [
      { id: "clothing", nameAr: "ملابس", nameEn: "Clothing" },
      { id: "shoes_bags", nameAr: "أحذية وشنط", nameEn: "Shoes & Bags" },
      { id: "perfumes", nameAr: "عطور", nameEn: "Perfumes" },
      { id: "cosmetics", nameAr: "مستحضرات تجميل", nameEn: "Cosmetics" },
      { id: "hair_beauty", nameAr: "حلاقة وتجميل", nameEn: "Hair & Beauty" },
    ],
  },
  {
    id: "health_sports",
    nameAr: "صحة ورياضة",
    nameEn: "Health & Sports",
    icon: "💪",
    subcategories: [
      { id: "pharmacies", nameAr: "صيدليات", nameEn: "Pharmacies" },
      { id: "clinics", nameAr: "عيادات", nameEn: "Clinics" },
      { id: "labs", nameAr: "معامل تحاليل", nameEn: "Laboratories" },
      { id: "gym_fitness", nameAr: "جيم ولياقة", nameEn: "Gym & Fitness" },
      { id: "sports", nameAr: "رياضة", nameEn: "Sports" },
    ],
  },
  {
    id: "home_furniture",
    nameAr: "المنزل والمفروشات",
    nameEn: "Home & Furniture",
    icon: "🏠",
    subcategories: [
      { id: "furniture", nameAr: "أثاث", nameEn: "Furniture" },
      { id: "furnishings", nameAr: "مفروشات", nameEn: "Furnishings" },
      { id: "toys", nameAr: "ألعاب أطفال", nameEn: "Toys" },
      { id: "libraries", nameAr: "مكتبات", nameEn: "Libraries" },
    ],
  },
  {
    id: "services_maintenance",
    nameAr: "خدمات وصيانة",
    nameEn: "Services & Maintenance",
    icon: "🔧",
    subcategories: [
      { id: "maintenance_centers", nameAr: "مراكز صيانة", nameEn: "Maintenance Centers" },
      { id: "spare_parts", nameAr: "قطع غيار", nameEn: "Spare Parts" },
      { id: "laundries", nameAr: "مغاسل", nameEn: "Laundries" },
      { id: "car_services", nameAr: "خدمات سيارات", nameEn: "Car Services" },
      { id: "real_estate", nameAr: "عقارات", nameEn: "Real Estate" },
      { id: "education_centers", nameAr: "مراكز تعليم", nameEn: "Education Centers" },
      { id: "general_supplies", nameAr: "توريدات عامة", nameEn: "General Supplies" },
      // Individual home services
      { id: "home_cleaning", nameAr: "تنظيف منازل", nameEn: "Home Cleaning" },
      { id: "plumbing", nameAr: "سباكة منزلية", nameEn: "Plumbing" },
      { id: "electrical", nameAr: "كهرباء منزلية", nameEn: "Electrical" },
      { id: "ac_repair", nameAr: "صيانة تكييف", nameEn: "AC Repair" },
      { id: "appliance_repair", nameAr: "إصلاح أجهزة منزلية", nameEn: "Appliance Repair" },
    ],
  },
  {
    id: "second_hand",
    nameAr: "مواد مستعملة",
    nameEn: "Second Hand",
    icon: "♻️",
    subcategories: [
      { id: "used_mobiles", nameAr: "موبايلات مستعملة", nameEn: "Used Mobiles" },
      { id: "used_electronics", nameAr: "إلكترونيات مستعملة", nameEn: "Used Electronics" },
      { id: "used_furniture", nameAr: "أثاث مستعمل", nameEn: "Used Furniture" },
      { id: "used_clothing", nameAr: "ملابس مستعملة", nameEn: "Used Clothing" },
      { id: "used_appliances", nameAr: "أجهزة منزلية مستعملة", nameEn: "Used Appliances" },
      { id: "used_cars", nameAr: "سيارات مستعملة", nameEn: "Used Cars" },
      { id: "used_books", nameAr: "كتب مستعملة", nameEn: "Used Books" },
      { id: "other_used", nameAr: "أخرى مستعملة", nameEn: "Other Used Items" },
    ],
  },
  {
    id: "other",
    nameAr: "أخرى",
    nameEn: "Other",
    icon: "📦",
    subcategories: [
      { id: "other_services", nameAr: "خدمات أخرى", nameEn: "Other Services" },
      { id: "other", nameAr: "أخرى", nameEn: "Other" },
    ],
  },
];

// Helper function to get all subcategories as flat list
export const getAllSubcategories = (): Category[] => {
  const allSubcategories: Category[] = [];
  MAIN_CATEGORIES.forEach((mainCat) => {
    mainCat.subcategories.forEach((sub) => {
      allSubcategories.push(sub);
    });
  });
  return allSubcategories;
};

// Helper function to get subcategories by main category ID
export const getSubcategoriesByMainCategory = (
  mainCategoryId: string
): Category[] => {
  const mainCategory = MAIN_CATEGORIES.find((cat) => cat.id === mainCategoryId);
  return mainCategory?.subcategories || [];
};

// Helper function to get main category by subcategory ID
export const getMainCategoryBySubcategory = (
  subcategoryId: string
): MainCategory | undefined => {
  return MAIN_CATEGORIES.find((mainCat) =>
    mainCat.subcategories.some((sub) => sub.id === subcategoryId)
  );
};

// Helper function to get category by ID (main or sub)
export const getCategoryById = (id: string): MainCategory | Category | undefined => {
  // Check main categories
  const mainCat = MAIN_CATEGORIES.find((cat) => cat.id === id);
  if (mainCat) return mainCat;

  // Check subcategories
  for (const mainCat of MAIN_CATEGORIES) {
    const subCat = mainCat.subcategories.find((sub) => sub.id === id);
    if (subCat) return subCat;
  }

  return undefined;
};

// Backward compatibility mapping for old category names to new structure
export const OLD_CATEGORY_MAPPING: Record<string, { mainCategory: string; subcategory?: string }> = {
  "مطاعم": { mainCategory: "restaurants_cafes", subcategory: "restaurants" },
  "كافيهات": { mainCategory: "restaurants_cafes", subcategory: "cafes" },
  "سوبر ماركت": { mainCategory: "supermarket_food", subcategory: "supermarket" },
  "مخابز": { mainCategory: "supermarket_food", subcategory: "bakeries" },
  "حلويات": { mainCategory: "supermarket_food", subcategory: "sweets" },
  "جزارة": { mainCategory: "supermarket_food", subcategory: "butcher" },
  "خضار وفاكهة": { mainCategory: "supermarket_food", subcategory: "vegetables_fruits" },
  "صيدليات": { mainCategory: "health_sports", subcategory: "pharmacies" },
  "مستحضرات تجميل": { mainCategory: "fashion_beauty", subcategory: "cosmetics" },
  "عطور": { mainCategory: "fashion_beauty", subcategory: "perfumes" },
  "ملابس": { mainCategory: "fashion_beauty", subcategory: "clothing" },
  "أحذية وشنط": { mainCategory: "fashion_beauty", subcategory: "shoes_bags" },
  "إلكترونيات": { mainCategory: "electronics_devices", subcategory: "electronics" },
  "موبايلات": { mainCategory: "electronics_devices", subcategory: "mobiles" },
  "كمبيوتر ولابتوب": { mainCategory: "electronics_devices", subcategory: "computers_laptops" },
  "أجهزة منزلية": { mainCategory: "electronics_devices", subcategory: "home_appliances" },
  "أثاث": { mainCategory: "home_furniture", subcategory: "furniture" },
  "مفروشات": { mainCategory: "home_furniture", subcategory: "furnishings" },
  "مكتبات": { mainCategory: "home_furniture", subcategory: "libraries" },
  "ألعاب أطفال": { mainCategory: "home_furniture", subcategory: "toys" },
  "رياضة": { mainCategory: "health_sports", subcategory: "sports" },
  "مراكز صيانة": { mainCategory: "services_maintenance", subcategory: "maintenance_centers" },
  "خدمات سيارات": { mainCategory: "services_maintenance", subcategory: "car_services" },
  "مغاسل": { mainCategory: "services_maintenance", subcategory: "laundries" },
  "حلاقة وتجميل": { mainCategory: "fashion_beauty", subcategory: "hair_beauty" },
  "جيم ولياقة": { mainCategory: "health_sports", subcategory: "gym_fitness" },
  "مراكز تعليم": { mainCategory: "services_maintenance", subcategory: "education_centers" },
  "عيادات": { mainCategory: "health_sports", subcategory: "clinics" },
  "معامل تحاليل": { mainCategory: "health_sports", subcategory: "labs" },
  "خدمات أخرى": { mainCategory: "other", subcategory: "other_services" },
  "أخرى": { mainCategory: "other", subcategory: "other" },
};

// Function to map old category name to new structure
export const mapOldCategoryToNew = (
  oldCategory: string
): { mainCategory: string; subcategory?: string } => {
  return OLD_CATEGORY_MAPPING[oldCategory] || { mainCategory: "other", subcategory: "other" };
};
