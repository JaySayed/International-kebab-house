// Multi-language support for International Kabab House
// Supporting English, Dari (درى), and Pashto (پښتو) for the Afghan community

export type Language = 'en' | 'fa' | 'ps';

export interface TranslationKey {
  en: string;
  fa: string; // Dari (Persian script)
  ps: string; // Pashto
}

export const translations: Record<string, TranslationKey> = {
  // Site Navigation
  'nav.home': {
    en: 'Home',
    fa: 'صفحه اصلی',
    ps: 'کور'
  },
  'nav.menu': {
    en: 'Menu',
    fa: 'منو',
    ps: 'مینو'
  },
  'nav.about': {
    en: 'About Us',
    fa: 'درباره ما',
    ps: 'زموږ په اړه'
  },
  'nav.contact': {
    en: 'Contact',
    fa: 'تماس',
    ps: 'اړیکه'
  },
  'nav.loyalty': {
    en: 'Loyalty Program',
    fa: 'برنامه وفاداری',
    ps: 'د وفادارۍ پروګرام'
  },
  'nav.catering': {
    en: 'Catering',
    fa: 'خدمات پذیرایی',
    ps: 'کیټرنګ'
  },
  'nav.reviews': {
    en: 'Reviews',
    fa: 'نظرات',
    ps: 'بیاکتنې'
  },

  // Common Actions
  'action.order_now': {
    en: 'Order Now',
    fa: 'هم اکنون سفارش دهید',
    ps: 'اوس آرډر ورکړئ'
  },
  'action.add_to_cart': {
    en: 'Add to Cart',
    fa: 'افزودن به سبد خرید',
    ps: 'ټوکرۍ ته اضافه کړئ'
  },
  'action.view_cart': {
    en: 'View Cart',
    fa: 'مشاهده سبد خرید',
    ps: 'ټوکرۍ وګورئ'
  },
  'action.checkout': {
    en: 'Checkout',
    fa: 'پرداخت',
    ps: 'چیک آوټ'
  },
  'action.submit': {
    en: 'Submit',
    fa: 'ارسال',
    ps: 'وسپارئ'
  },
  'action.cancel': {
    en: 'Cancel',
    fa: 'لغو',
    ps: 'لغوه کړئ'
  },

  // Food Categories
  'category.appetizers': {
    en: 'Appetizers',
    fa: 'پیش غذا',
    ps: 'پیل خواړه'
  },
  'category.kabab_specialties': {
    en: 'Kabab Specialties',
    fa: 'کباب های ویژه',
    ps: 'د کباب ځانګړتیاوې'
  },
  'category.rice_dishes': {
    en: 'Rice Dishes',
    fa: 'غذاهای برنج',
    ps: 'د وریجو خواړه'
  },
  'category.karahi': {
    en: 'Karahi',
    fa: 'کڑاهی',
    ps: 'کړاهی'
  },
  'category.family_platters': {
    en: 'Family Platters',
    fa: 'سینی های خانوادگی',
    ps: 'د کورنۍ پلیټونه'
  },
  'category.beverages': {
    en: 'Beverages',
    fa: 'نوشیدنی ها',
    ps: 'څښاک'
  },
  'category.desserts': {
    en: 'Desserts',
    fa: 'دسر',
    ps: 'خوږ خواړه'
  },
  'category.kids_menu': {
    en: 'Kids Menu',
    fa: 'منوی کودکان',
    ps: 'د ماشومانو مینو'
  },

  // Homepage Content
  'home.welcome': {
    en: 'Welcome to International Kabab House',
    fa: 'به خانه کباب بین المللی خوش آمدید',
    ps: 'نړیوال کباب کور ته ښه راغلاست'
  },
  'home.tagline': {
    en: 'Authentic Afghan & Middle Eastern Cuisine',
    fa: 'غذاهای اصیل افغانی و خاورمیانه',
    ps: 'اصیل افغاني او منځني ختیځ خواړه'
  },
  'home.description': {
    en: 'Experience the rich flavors of Afghanistan with our traditional recipes passed down through generations.',
    fa: 'طعم های غنی افغانستان را با دستور العمل های سنتی ما که از نسل به نسل منتقل شده، تجربه کنید.',
    ps: 'زموږ د دودیزو ترکیبونو سره د افغانستان بډای خوندونه تجربه کړئ چې له نسل څخه نسل ته تېر شوي.'
  },

  // Menu Items (Sample Afghan dishes)
  'dish.chopan_kabab': {
    en: 'Chopan Kabab',
    fa: 'چوپان کباب',
    ps: 'د چوپان کباب'
  },
  'dish.qabuli_pulao': {
    en: 'Qabuli Pulao',
    fa: 'قابلی پلو',
    ps: 'قابلي پلاو'
  },
  'dish.afghani_burger': {
    en: 'Afghani Burger',
    fa: 'برگر افغانی',
    ps: 'افغاني برګر'
  },
  'dish.mantu': {
    en: 'Mantu',
    fa: 'منتو',
    ps: 'منتو'
  },
  'dish.ashak': {
    en: 'Ashak',
    fa: 'اشک',
    ps: 'اشک'
  },
  'dish.lamb_karahi': {
    en: 'Lamb Karahi',
    fa: 'کڑاهی گوسفند',
    ps: 'د وره کړاهی'
  },

  // Order Status
  'order.status.pending': {
    en: 'Pending',
    fa: 'در انتظار',
    ps: 'پاتې'
  },
  'order.status.confirmed': {
    en: 'Confirmed',
    fa: 'تایید شده',
    ps: 'تایید شوی'
  },
  'order.status.preparing': {
    en: 'Preparing',
    fa: 'در حال آماده سازی',
    ps: 'چمتو کوي'
  },
  'order.status.ready': {
    en: 'Ready for Pickup',
    fa: 'آماده برای تحویل',
    ps: 'د اخیستو لپاره چمتو'
  },
  'order.status.delivered': {
    en: 'Delivered',
    fa: 'تحویل داده شده',
    ps: 'سپارل شوی'
  },

  // Forms and Labels
  'form.name': {
    en: 'Name',
    fa: 'نام',
    ps: 'نوم'
  },
  'form.email': {
    en: 'Email',
    fa: 'ایمیل',
    ps: 'بریښنالیک'
  },
  'form.phone': {
    en: 'Phone',
    fa: 'تلفن',
    ps: 'تلیفون'
  },
  'form.address': {
    en: 'Address',
    fa: 'آدرس',
    ps: 'پته'
  },
  'form.message': {
    en: 'Message',
    fa: 'پیام',
    ps: 'پیغام'
  },
  'form.rating': {
    en: 'Rating',
    fa: 'امتیاز',
    ps: 'درجه بندي'
  },
  'form.review': {
    en: 'Review',
    fa: 'نظر',
    ps: 'بیاکتنه'
  },

  // Loyalty Program
  'loyalty.points': {
    en: 'Points',
    fa: 'امتیاز',
    ps: 'ټکي'
  },
  'loyalty.rewards': {
    en: 'Rewards',
    fa: 'جوایز',
    ps: 'انعامونه'
  },
  'loyalty.member_since': {
    en: 'Member since',
    fa: 'عضو از',
    ps: 'غړی د'
  },
  'loyalty.total_orders': {
    en: 'Total Orders',
    fa: 'کل سفارشات',
    ps: 'ټول آرډرونه'
  },
  'loyalty.total_spent': {
    en: 'Total Spent',
    fa: 'کل خرج',
    ps: 'ټول لګښت'
  },

  // Contact Information
  'contact.hours': {
    en: 'Hours of Operation',
    fa: 'ساعات کاری',
    ps: 'د کار ساعتونه'
  },
  'contact.address_label': {
    en: 'Address',
    fa: 'آدرس',
    ps: 'پته'
  },
  'contact.phone_label': {
    en: 'Phone',
    fa: 'تلفن',
    ps: 'تلیفون'
  },
  'contact.email_label': {
    en: 'Email',
    fa: 'ایمیل',
    ps: 'بریښنالیک'
  },

  // Time and Days
  'time.monday': {
    en: 'Monday',
    fa: 'دوشنبه',
    ps: 'دوشنبه'
  },
  'time.tuesday': {
    en: 'Tuesday',
    fa: 'سه شنبه',
    ps: 'درېشنبه'
  },
  'time.wednesday': {
    en: 'Wednesday',
    fa: 'چهارشنبه',
    ps: 'څلورشنبه'
  },
  'time.thursday': {
    en: 'Thursday',
    fa: 'پنج شنبه',
    ps: 'پینځشنبه'
  },
  'time.friday': {
    en: 'Friday',
    fa: 'جمعه',
    ps: 'جمعه'
  },
  'time.saturday': {
    en: 'Saturday',
    fa: 'شنبه',
    ps: 'شنبه'
  },
  'time.sunday': {
    en: 'Sunday',
    fa: 'یکشنبه',
    ps: 'یکشنبه'
  },

  // Messages and Notifications
  'message.welcome_loyalty': {
    en: 'Welcome to our loyalty program! You\'ve earned 100 welcome points.',
    fa: 'به برنامه وفاداری ما خوش آمدید! شما ۱۰۰ امتیاز خوش آمدگویی کسب کردید.',
    ps: 'زموږ د وفادارۍ پروګرام ته ښه راغلاست! تاسو ۱۰۰ د ښه راغلاست ټکي ترلاسه کړي.'
  },
  'message.order_confirmed': {
    en: 'Your order has been confirmed. Thank you!',
    fa: 'سفارش شما تایید شد. متشکریم!',
    ps: 'ستاسو آرډر تایید شو. ستاسو له مننې!'
  },
  'message.cart_empty': {
    en: 'Your cart is empty. Add some delicious items!',
    fa: 'سبد خرید شما خالی است. چند آیتم خوشمزه اضافه کنید!',
    ps: 'ستاسو ټوکرۍ خالي دی. ځینې خوندور توکي اضافه کړئ!'
  },

  // Cultural Phrases
  'greeting.welcome': {
    en: 'Welcome',
    fa: 'خوش آمدید',
    ps: 'ښه راغلاست'
  },
  'greeting.thank_you': {
    en: 'Thank you',
    fa: 'متشکریم',
    ps: 'ستاسو له مننې'
  },
  'greeting.peace': {
    en: 'Peace be upon you',
    fa: 'سلام علیکم',
    ps: 'سلام علیکم'
  }
};

// Language metadata
export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸'
  },
  fa: {
    name: 'Dari',
    nativeName: 'درى',
    dir: 'rtl',
    flag: '🇦🇫'
  },
  ps: {
    name: 'Pashto',
    nativeName: 'پښتو',
    dir: 'rtl',
    flag: '🇦🇫'
  }
};

// Translation helper function
export function t(key: string, lang: Language = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[lang] || translation.en;
}

// RTL (Right-to-Left) language check
export function isRTL(lang: Language): boolean {
  return languages[lang].dir === 'rtl';
}

// Get language direction
export function getDirection(lang: Language): 'ltr' | 'rtl' {
  return languages[lang].dir as 'ltr' | 'rtl';
}