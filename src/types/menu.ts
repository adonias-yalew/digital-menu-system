// Menu and Feedback Types for Supabase Integration

export type LangText = {
  en: string;
  am: string;
  om: string;
};

export type AddOn = {
  name: LangText;
  price: number;
};

export type Ingredient = {
  name: LangText;
  amount: string;
};

// Database table for menu_items
export interface MenuItem {
  id: string;
  name_en: string;
  name_am: string;
  name_om: string;
  description_en: string;
  description_am: string;
  description_om: string;
  price: number;
  category: 'burgers' | 'sides' | 'drinks' | 'chicken' | 'desserts' | 'breakfast';
  is_spicy: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_new: boolean;
  image_url: string;
  weight?: string;
  created_at: string;
  updated_at?: string;
}

// Database table for feedbacks
export interface Feedback {
  id: string;
  customer_name: string;
  message: string;
  rating: number; // 1-5 stars
  created_at: string;
}

// Combined item type for frontend (with legacy compatibility)
export type Item = {
  name: LangText;
  price: number;
  img: string;
  description: LangText;
  category: MenuItem['category'];
  ingredients?: Ingredient[];
  addOns?: AddOn[];
  weight?: string;
  isPopular: boolean;
  isSpicy: boolean;
  isVeg: boolean;
  isNew: boolean;
};

// Category mapping for UI
export const CATEGORY_MAP = {
  all: { en: "All", am: "ሁሉም", om: "Hunda" },
  burgers: { en: "Burgers", am: "በርገሮች", om: "Burgaarota" },
  sides: { en: "Sides", am: "ጎን ምግቦች", om: "Cinaa" },
  drinks: { en: "Drinks", am: "መጠጦች", om: "Dhugaatii" },
  chicken: { en: "Chicken", am: "ዶሮ", om: "Diga" },
  desserts: { en: "Desserts", am: "የምግብ መጨረሻ", om: "Cidha" },
  breakfast: { en: "Breakfast", am: "የጠዋቱ ምግብ", om: "Ergaa Qophe" },
} as const;

export type CategoryKey = keyof typeof CATEGORY_MAP;

export const FILTER_KEYS = ["all", "popular", "spicy", "veg", "new"] as const;
export type FilterKey = typeof FILTER_KEYS[number];

export const PRICE_FILTERS = ["all", "standard", "premium", "luxury"] as const;
export type PriceFilter = typeof PRICE_FILTERS[number];
