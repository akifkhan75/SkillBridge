// ============================================================
// Fixli i18n System
// Supports English, Arabic (RTL), and Urdu (RTL)
// ============================================================

import { I18nManager } from 'react-native';

export type SupportedLocale = 'en' | 'ar' | 'ur';

// Simplified translations — import full translation files for production
const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    'app.name': 'Triply',
    'app.loadingLocation': 'Loading...',
    'nav.home': 'Home',
    'nav.bookings': 'Bookings',
    'nav.chat': 'Chat',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'login.title': 'Sign In',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.signup': 'Create Account',
    'signup.title': 'Create Account',
    'signup.role.title': 'Join as',
    'signup.role.customer': 'Customer',
    'signup.role.worker': 'Professional',
    'signup.name': 'Full Name',
    'home.greeting': 'Hello,',
    'home.search': 'Describe what you need help with...',
    'home.services': 'Services',
    'home.categories': 'Categories',
    'home.sos.label': 'SOS Emergency Button',
    'home.notif.label': 'Notifications',
    'home.category.other': 'Not sure? Show us',
    'home.search.label': 'Search for a service',
    'home.aiHero.title': 'AI-Powered Matching',
    'home.aiHero.subtitle': 'Describe your problem and we\'ll find the perfect professional',
    'worker.dashboard': 'Dashboard',
    'worker.jobs': 'Job Requests',
    'worker.projects': 'Projects',
    'worker.payments': 'Payments',
    'worker.analytics': 'Analytics',
    'worker.schedule': 'Schedule',
    'worker.arTools': 'AR Tools',
    'worker.profile': 'My Profile',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'common.logout': 'Log Out',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
  },
  ar: {
    'app.name': 'تريبلي',
    'app.loadingLocation': 'جاري التحميل...',
    'nav.home': 'الرئيسية',
    'nav.bookings': 'الحجوزات',
    'nav.chat': 'المحادثات',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    'login.title': 'تسجيل الدخول',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.button': 'تسجيل الدخول',
    'login.signup': 'إنشاء حساب',
    'signup.title': 'إنشاء حساب',
    'signup.role.title': 'انضم كـ',
    'signup.role.customer': 'عميل',
    'signup.role.worker': 'محترف',
    'signup.name': 'الاسم الكامل',
    'home.greeting': 'مرحباً,',
    'home.search': 'صف ما تحتاج مساعدة به...',
    'home.services': 'الخدمات',
    'home.categories': 'الفئات',
    'home.sos.label': 'زر طوارئ SOS',
    'home.notif.label': 'الإشعارات',
    'home.category.other': 'غير متأكد؟ أرنا',
    'home.search.label': 'ابحث عن خدمة',
    'common.logout': 'تسجيل الخروج',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.back': 'رجوع',
  },
  ur: {
    'app.name': 'ٹرپلی',
    'app.loadingLocation': 'لوڈ ہو رہا ہے...',
    'nav.home': 'ہوم',
    'nav.bookings': 'بکنگز',
    'nav.chat': 'چیٹ',
    'nav.profile': 'پروفائل',
    'nav.settings': 'سیٹنگز',
    'login.title': 'سائن ان',
    'login.email': 'ای میل',
    'login.password': 'پاسورڈ',
    'login.button': 'سائن ان',
    'login.signup': 'اکاؤنٹ بنائیں',
    'signup.title': 'اکاؤنٹ بنائیں',
    'signup.role.title': 'بطور شامل ہوں',
    'signup.role.customer': 'کسٹمر',
    'signup.role.worker': 'پیشہ ور',
    'signup.name': 'پورا نام',
    'home.greeting': 'ہیلو,',
    'home.search': 'بتائیں آپ کو کس چیز میں مدد چاہیے...',
    'home.services': 'خدمات',
    'home.categories': 'اقسام',
    'home.sos.label': 'ہنگامی ایس او ایس بٹن',
    'home.notif.label': 'اطلاعات',
    'home.category.other': 'یقین نہیں؟ ہمیں دکھائیں',
    'home.search.label': 'سروس تلاش کریں',
    'common.logout': 'لاگ آؤٹ',
    'common.cancel': 'منسوخ',
    'common.save': 'محفوظ',
    'common.back': 'واپس',
  },
};

const RTL_LOCALES: SupportedLocale[] = ['ar', 'ur'];

let currentLocale: SupportedLocale = 'en';

export function setLocale(locale: SupportedLocale) {
  currentLocale = locale;
  const isRTL = RTL_LOCALES.includes(locale);
  I18nManager.forceRTL(isRTL);
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function t(key: string): string {
  return translations[currentLocale]?.[key] || translations.en[key] || key;
}

export function isRTL(): boolean {
  return RTL_LOCALES.includes(currentLocale);
}

export function getDirection(): 'ltr' | 'rtl' {
  return isRTL() ? 'rtl' : 'ltr';
}
