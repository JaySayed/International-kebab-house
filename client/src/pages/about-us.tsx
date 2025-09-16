'use client';

import logoImage from '@assets/IMG_0247_1753076429818.jpeg';

// Import food images from Menu page
import qabuliPulaoImg from "@assets/generated_images/Qabuli_Pulao_dish_544cb5b2.png";
import chickenTikkaImg from "@assets/generated_images/Chicken_Tikka_Kabab_a78e3a35.png";
import mantuImg from "@assets/generated_images/Mantu_Afghan_dumplings_29495451.png";
import appetizerImg from "@assets/generated_images/Afghan_appetizers_platter_12ae089e.png";

export default function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        <img 
          src={logoImage} 
          alt="International Kabab House Logo" 
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full object-cover border-4 border-primary/20"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">About International Kabab House</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Authentic Afghan & Middle Eastern Cuisine Since 2015</p>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-certificate text-emerald-500"></i>
            <span className="text-emerald-600 font-medium">100% Halal Certified</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Stone Mountain, GA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Restaurant Story Section */}
        <section className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-book text-primary-foreground text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-primary">Our Story</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Founded in 2015, International Kabab House began as a family dream to bring authentic Afghan and Middle Eastern flavors to Stone Mountain, Georgia. Our journey started with traditional recipes passed down through generations from the heart of Afghanistan.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              We believe that food is more than sustenance—it's a bridge between cultures, a way to share love, and a means to bring families together around the table with authentic flavors and warm hospitality.
            </p>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">Our Heritage</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  <span className="text-muted-foreground">Family-owned Afghan restaurant since 2015</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  <span className="text-muted-foreground">Traditional Afghan cooking methods</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  <span className="text-muted-foreground">Authentic Middle Eastern spice blends</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-emerald-500"></i>
                  <span className="text-muted-foreground">Fresh ingredients sourced daily</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-heart text-primary-foreground text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-primary">Our Values</h2>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-star text-primary"></i>
                <h3 className="font-semibold text-foreground">Quality First</h3>
              </div>
              <p className="text-sm text-muted-foreground">We source the finest halal ingredients and prepare every dish with meticulous attention to authentic Afghan cooking traditions.</p>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-users text-primary"></i>
                <h3 className="font-semibold text-foreground">Community</h3>
              </div>
              <p className="text-sm text-muted-foreground">We're proud to serve Stone Mountain and create a welcoming space where all families can enjoy authentic Afghan hospitality.</p>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-leaf text-primary"></i>
                <h3 className="font-semibold text-foreground">Tradition</h3>
              </div>
              <p className="text-sm text-muted-foreground">Honoring time-tested Afghan recipes while embracing modern culinary techniques and fresh presentation.</p>
            </div>
          </div>
        </section>

        {/* Halal Certification Section */}
        <section className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-certificate text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-primary">Halal Certification</h2>
          </div>
          
          <div className="space-y-4">
            <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <i className="fa-solid fa-shield-halved text-white text-xl"></i>
              </div>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">100% Halal Certified</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-500">Certified by Islamic Food Council of America</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Our Halal Commitment</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                  <span className="text-muted-foreground">All meat sourced from certified Halal suppliers</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                  <span className="text-muted-foreground">Dedicated Halal preparation areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                  <span className="text-muted-foreground">Regular certification audits and inspections</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                  <span className="text-muted-foreground">Strict no alcohol or pork policy</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-emerald-500 mt-1"></i>
                  <span className="text-muted-foreground">Islamic-compliant cooking methods</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Certification ID: IKH-2025-001<br />
                Valid through: December 2025
              </p>
            </div>
          </div>
        </section>
        
      </div>

      {/* Afghan Cuisine Heritage Section */}
      <section className="bg-card border border-border rounded-xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">🇦🇫 Afghan Culinary Heritage</h2>
          <p className="text-muted-foreground">Discover the rich traditions behind our authentic dishes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img src={qabuliPulaoImg} alt="Qabuli Pulao" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Pulao Traditions</h3>
            <p className="text-sm text-muted-foreground">Our signature rice dishes like Qabuli and Uzbeki Pulao represent centuries of Afghan culinary excellence.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img src={chickenTikkaImg} alt="Chicken Tikka Kabab" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Kabab Mastery</h3>
            <p className="text-sm text-muted-foreground">Traditional grilling techniques passed down through generations create our perfectly seasoned kababs.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img src={mantuImg} alt="Mantu Afghan Dumplings" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Afghan Specialties</h3>
            <p className="text-sm text-muted-foreground">Authentic dishes like Mantu dumplings and Bolany flatbread showcase Afghanistan's unique flavors.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img src={appetizerImg} alt="Afghan Spiced Appetizers" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Spice Heritage</h3>
            <p className="text-sm text-muted-foreground">Carefully selected spices and herbs create the distinctive flavors that make Afghan cuisine unforgettable.</p>
          </div>
        </div>
      </section>

      {/* Location and Contact Footer */}
      <div className="text-center py-8 border-t border-border">
        <h3 className="text-xl font-bold text-primary mb-4">Visit International Kabab House</h3>
        <p className="text-muted-foreground mb-2">📍 6045 Memorial Dr, Ste 15, Stone Mountain, GA 30083</p>
        <p className="text-muted-foreground mb-4">📞 (470) 990-6345 | 📧 internationalkababhouse@gmail.com</p>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-clock text-primary"></i>
            <span>Tue-Sun: 11 AM - 10 PM</span>
          </span>
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-times-circle text-destructive"></i>
            <span>Closed Mondays</span>
          </span>
        </div>
      </div>
    </div>
  );
}