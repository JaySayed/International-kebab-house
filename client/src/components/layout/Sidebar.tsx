'use client';

import { Link, useLocation } from "wouter";
import logoImage from "@assets/IMG_0252_1753076429818.jpeg";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export default function Sidebar() {
  const [location] = useLocation();
  const { language, direction } = useLanguage();

  const navItems = [
    { path: "/", icon: "fa-house", label: t('nav.home', language) },
    { path: "/menu", icon: "fa-utensils", label: t('nav.menu', language) },
    { path: "/online-order", icon: "fa-shopping-cart", label: t('action.order_now', language) },
    { path: "/about-us", icon: "fa-info-circle", label: t('nav.about', language) },
    { path: "/contact", icon: "fa-phone", label: t('nav.contact', language) },
    { path: "/loyalty-program", icon: "fa-star", label: t('nav.loyalty', language) },
    { path: "/catering", icon: "fa-concierge-bell", label: t('nav.catering', language) },
    { path: "/reviews", icon: "fa-comments", label: t('nav.reviews', language) },
  ];

  return (
    <aside className={`w-64 bg-card border-r border-border flex flex-col ${direction === 'rtl' ? 'border-l border-r-0' : ''}`} dir={direction}>
      <div className="flex-1 py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-secondary/50 rounded-lg border border-primary/20">
            <img 
              src={logoImage} 
              alt="International Kabab House Logo" 
              className="h-10 w-10 rounded-full object-cover border border-primary"
            />
            <div>
              <h2 className="text-sm font-bold text-primary">International</h2>
              <p className="text-sm font-bold text-primary">Kabab House</p>
            </div>
          </div>
        </div>
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10 font-medium border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <i className={`fa-solid ${item.icon} mr-3`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
