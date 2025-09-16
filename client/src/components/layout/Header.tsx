'use client';

import logoImage from "@assets/IMG_0252_1753076429818.jpeg";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export default function Header() {
  const { language } = useLanguage();
  
  return (
    <header className="card-enhanced border-b border-border px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <img 
              src={logoImage} 
              alt="International Kabab House Logo" 
              className="h-14 w-16 rounded-lg object-contain border-2 border-primary logo-glow animate-pulse-glow p-1"
            />
            <div>
              <h1 className="text-xl font-bold gradient-text animate-float">International Kabab House</h1>
              <p className="text-xs text-muted-foreground animate-bounce-subtle">{t('home.tagline', language)} ✨</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-phone text-primary"></i>
              <span className="text-sm text-foreground">
                <a href="tel:(770) 555-0123" className="hover:text-primary transition-colors">
                  (770) 555-0123
                </a>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-envelope text-primary"></i>
              <span className="text-sm text-foreground">internationalkababhouse@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 px-3 py-1 rounded text-white text-xs font-medium glow-emerald animate-pulse">
              <i className="fa-solid fa-certificate mr-1 animate-spin-slow"></i>HALAL
            </div>
            <div className="bg-emerald-600 px-3 py-1 rounded text-white text-xs font-medium glow-emerald animate-pulse">CERTIFIED</div>
          </div>
          <button className="btn-primary-enhanced px-6 py-2 rounded-lg font-medium animate-bounce-subtle">
            <i className="fa-solid fa-shopping-cart mr-2"></i>{t('action.order_now', language)}
          </button>
        </div>
      </div>
    </header>
  );
}
