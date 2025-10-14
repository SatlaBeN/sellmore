
export type Locale = "en" | "he" | "ru" | "ar";

export const rtlLocales: Locale[] = ["he", "ar"];

export const dict: Record<Locale, Record<string, string>> = {
  en: {
    app_title: "SellMore",
    nav_dashboard: "Dashboard",
    nav_pricing: "Upgrade Plan",
    nav_market: "Marketplace",
    home_intro: "Sign in via Whop, then buy UGC or add-on services inside your product.",
    dashboard_title: "Dashboard",
    pricing_title: "Plans",
    pricing_free: "Free",
    pricing_mid: "Mid",
    pricing_pro: "Pro",
    pricing_free_desc: "Up to 3 products",
    pricing_mid_desc: "Up to 25 products",
    pricing_pro_desc: "Unlimited",
    choose: "Choose",
    vendor_title: "My Products",
    add: "Add",
    market_title: "Store",
    buy: "Buy",
    price_currency: "₪",
    need_login: "Please sign in via Whop"
  },
  he: {
    app_title: "SellMore",
    nav_dashboard: "דשבורד",
    nav_pricing: "שדרוג מנוי",
    nav_market: "חנות מוצרים",
    home_intro: "כניסה דרך Whop ואז רכישת UGC או שירותים מתוך המוצר.",
    dashboard_title: "דשבורד",
    pricing_title: "תכניות",
    pricing_free: "Free",
    pricing_mid: "Mid",
    pricing_pro: "Pro",
    pricing_free_desc: "עד 3 מוצרים",
    pricing_mid_desc: "עד 25 מוצרים",
    pricing_pro_desc: "ללא מגבלה",
    choose: "בחר",
    vendor_title: "מוצרים שלי",
    add: "הוסף",
    market_title: "חנות",
    buy: "קנה",
    price_currency: "₪",
    need_login: "אנא התחבר דרך Whop"
  },
  ru: {
    app_title: "SellMore",
    nav_dashboard: "Панель",
    nav_pricing: "Тарифы",
    nav_market: "Магазин",
    home_intro: "Войдите через Whop, затем покупайте UGC и сервисы внутри продукта.",
    dashboard_title: "Панель",
    pricing_title: "Тарифы",
    pricing_free: "Free",
    pricing_mid: "Mid",
    pricing_pro: "Pro",
    pricing_free_desc: "До 3 товаров",
    pricing_mid_desc: "До 25 товаров",
    pricing_pro_desc: "Без ограничений",
    choose: "Выбрать",
    vendor_title: "Мои товары",
    add: "Добавить",
    market_title: "Магазин",
    buy: "Купить",
    price_currency: "₪",
    need_login: "Пожалуйста, войдите через Whop"
  },
  ar: {
    app_title: "SellMore",
    nav_dashboard: "لوحة التحكم",
    nav_pricing: "الخطط",
    nav_market: "المتجر",
    home_intro: "سجّل عبر Whop ثم اشترِ UGC أو خدمات إضافية داخل منتجك.",
    dashboard_title: "لوحة التحكم",
    pricing_title: "الخطط",
    pricing_free: "Free",
    pricing_mid: "Mid",
    pricing_pro: "Pro",
    pricing_free_desc: "حتى 3 منتجات",
    pricing_mid_desc: "حتى 25 منتجًا",
    pricing_pro_desc: "غير محدود",
    choose: "اختر",
    vendor_title: "منتجاتي",
    add: "إضافة",
    market_title: "المتجر",
    buy: "شراء",
    price_currency: "₪",
    need_login: "يرجى تسجيل الدخول عبر Whop"
  }
};

export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? key;
}
