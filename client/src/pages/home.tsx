'use client';

// Restaurant photos and interior images
import restaurantExterior from "@assets/IMG_0232_1756598591783.jpeg";
import restaurantInterior1 from "@assets/IMG_0232_1756598591783.jpeg";
import logoImage from "@assets/IMG_0252_1753076429818.jpeg";
import kitchenArea from "@assets/IMG_0232_1756598591783.jpeg";
import diningArea from "@assets/IMG_0232_1756598591783.jpeg";
import foodDisplay from "@assets/IMG_0232_1756598591783.jpeg";
import restaurantSign from "@assets/IMG_0232_1756598591783.jpeg";
import interiorView from "@assets/IMG_0232_1756598591783.jpeg";
import frontView from "@assets/IMG_0232_1756598591783.jpeg";

// Import new components
import VirtualMenuPreview from "@/components/VirtualMenuPreview";
import CustomerReviews from "@/components/CustomerReviews";
import OnlineReservation from "@/components/OnlineReservation";
import NewsletterSignup from "@/components/NewsletterSignup";
import LazyImage from "@/components/LazyImage";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="relative text-center z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text animate-float">International Kabab House</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 text-foreground">Authentic Afghan & Middle Eastern Cuisine</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-muted-foreground max-w-2xl mx-auto">Experience traditional flavors from kababs to qabuli pulao, crafted with authentic recipes and halal-certified ingredients</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a href="/menu" className="btn-primary-enhanced px-6 sm:px-8 py-3 rounded-lg font-medium inline-block animate-bounce-subtle">
              <i className="fa-solid fa-utensils mr-2"></i>View Our Menu
            </a>
            <a href="/online-order" className="card-enhanced border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-lg font-medium hover:glow-accent transition-all inline-block">
              <i className="fa-solid fa-shopping-cart mr-2 animate-spin-slow"></i>Order Now
            </a>
          </div>
        </div>
      </section>

      {/* About Restaurant Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-bounce-subtle">🏛️ About Our Restaurant</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Located in the heart of Stone Mountain, Georgia, International Kabab House brings authentic Afghan and Middle Eastern flavors to our community. 
              We're committed to serving traditional dishes prepared with fresh ingredients and time-honored recipes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="card-enhanced rounded-xl overflow-hidden animate-float">
              <LazyImage
                src={restaurantExterior} 
                alt="International Kabab House Exterior" 
                className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500" 
                placeholder="restaurant"
              />
            </div>
            <div className="space-y-6">
              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <i className="fa-solid fa-certificate text-emerald-500 text-2xl mr-3"></i>
                  <h3 className="text-xl font-bold text-foreground">100% Halal Certified</h3>
                </div>
                <p className="text-muted-foreground">All our ingredients and cooking methods are halal-certified, ensuring authentic and trusted dining for our Muslim community and all guests.</p>
              </div>
              
              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <i className="fa-solid fa-heart text-primary text-2xl mr-3"></i>
                  <h3 className="text-xl font-bold text-foreground">Family Owned & Operated</h3>
                </div>
                <p className="text-muted-foreground">Since our opening, we've been proudly family-owned, bringing traditional Afghan hospitality and recipes passed down through generations.</p>
              </div>

              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <i className="fa-solid fa-utensils text-accent text-2xl mr-3"></i>
                  <h3 className="text-xl font-bold text-foreground">Authentic Recipes</h3>
                </div>
                <p className="text-muted-foreground">Our chefs prepare every dish using traditional methods and authentic spice blends imported directly from Afghanistan and the Middle East.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-float">📍 Visit Us Today</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Conveniently located in Stone Mountain with ample parking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-start mb-4">
                  <i className="fa-solid fa-map-marker-alt text-primary text-2xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Our Address</h3>
                    <p className="text-muted-foreground text-lg">6045 Memorial Dr, Suite 15</p>
                    <p className="text-muted-foreground text-lg">Stone Mountain, GA 30083</p>
                    <a href="https://maps.google.com/?q=6045+Memorial+Dr+Suite+15+Stone+Mountain+GA+30083" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-flex items-center mt-3 text-primary hover:text-accent transition-colors">
                      <i className="fa-solid fa-external-link-alt mr-2"></i>Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-start mb-4">
                  <i className="fa-solid fa-clock text-accent text-2xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Hours of Operation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday</span>
                        <span className="text-destructive font-medium">Closed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tuesday - Sunday</span>
                        <span className="text-foreground font-medium">11:00 AM - 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-enhanced p-6 rounded-xl">
                <div className="flex items-start mb-4">
                  <i className="fa-solid fa-phone text-primary text-2xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Contact Information</h3>
                    <p className="text-muted-foreground mb-2">
                      <a href="tel:+14709906345" className="hover:text-primary transition-colors">
                        (470) 990-6345
                      </a>
                    </p>
                    <p className="text-muted-foreground">
                      <a href="mailto:internationalkababhouse@gmail.com" className="hover:text-primary transition-colors">
                        internationalkababhouse@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden relative h-96">
              {/* Google Maps - Now fully interactive without overlay */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.8!2d-84.1697293!3d33.8081567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5043ad3e5e4b3%3A0x7c8a8b2d7f8c9e0f!2s6045%20Memorial%20Dr%2C%20Stone%20Mountain%2C%20GA%2030083%2C%20USA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                title="International Kabab House Location Map - 6045 Memorial Dr, Stone Mountain, GA"
              ></iframe>
              
              {/* Small floating info badge - positioned to not interfere with map interaction */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <p className="text-sm font-semibold text-foreground">📍 Our Location</p>
                <a 
                  href="https://maps.google.com/?q=6045+Memorial+Dr+Suite+15+Stone+Mountain+GA+30083" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-1 text-primary hover:text-accent transition-colors text-xs"
                  data-testid="link-open-maps"
                >
                  <i className="fa-solid fa-external-link-alt mr-1"></i>Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Gallery Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-shimmer">📸 Restaurant Gallery</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Take a look inside our welcoming atmosphere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={restaurantInterior1} 
                alt="Restaurant Interior" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Dining Area</h4>
                <p className="text-sm text-muted-foreground">Comfortable seating for families and groups</p>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={diningArea} 
                alt="Dining Space" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Main Dining Hall</h4>
                <p className="text-sm text-muted-foreground">Spacious and welcoming environment</p>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={kitchenArea} 
                alt="Kitchen Area" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Open Kitchen</h4>
                <p className="text-sm text-muted-foreground">Watch our chefs prepare your meal</p>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={foodDisplay} 
                alt="Food Display" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Fresh Preparations</h4>
                <p className="text-sm text-muted-foreground">Daily fresh ingredients and preparations</p>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={restaurantSign} 
                alt="Restaurant Signage" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Restaurant Entrance</h4>
                <p className="text-sm text-muted-foreground">Easy to find location on Memorial Drive</p>
              </div>
            </div>

            <div className="card-enhanced rounded-xl overflow-hidden animate-float group">
              <img 
                src={interiorView} 
                alt="Interior View" 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <h4 className="font-semibold text-foreground">Cozy Atmosphere</h4>
                <p className="text-sm text-muted-foreground">Perfect for family dining and gatherings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Menu Preview */}
      <VirtualMenuPreview />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Online Reservation */}
      <OnlineReservation />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Call to Action Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-enhanced p-8 sm:p-12 rounded-xl">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4 animate-float">Ready to Experience Authentic Flavors?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Visit us today, make a reservation, or order online for pickup and delivery. Taste the difference that authentic recipes and fresh ingredients make.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a href="/menu" className="btn-primary-enhanced px-6 sm:px-8 py-3 rounded-lg font-medium inline-block animate-bounce-subtle" data-testid="link-explore-menu">
                <i className="fa-solid fa-utensils mr-2"></i>Explore Menu
              </a>
              <a href="/online-order" className="card-enhanced border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-lg font-medium hover:glow-accent transition-all inline-block" data-testid="link-order-online-cta">
                <i className="fa-solid fa-shopping-cart mr-2 animate-spin-slow"></i>Order Online
              </a>
              <a href="/contact" className="card-enhanced border-2 border-accent text-accent px-6 sm:px-8 py-3 rounded-lg font-medium hover:glow-accent transition-all inline-block" data-testid="link-contact-us">
                <i className="fa-solid fa-phone mr-2"></i>Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}