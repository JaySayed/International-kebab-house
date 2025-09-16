import { useQuery } from "@tanstack/react-query";
import type { MenuItem } from "@shared/schema";

export default function VirtualMenuPreview() {
  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Get featured items from different categories
  const featuredItems = menuItems?.filter(item => 
    ['Qabuli Pulao', 'Chicken Tikka Kabab', 'Beef Tikka Kabab', 'Mantu', 'Lamb Karahi', 'Ashak'].includes(item.name)
  ).slice(0, 6) || [];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-shimmer">🍽️ Quick Menu Preview</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Get a taste of our most popular dishes - explore our full menu for complete selection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div key={item.id} className="card-enhanced rounded-xl p-4 hover:scale-105 transition-all duration-300 animate-float group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                <div className="text-xl font-bold text-primary">${item.price}</div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <i className="fa-solid fa-certificate text-emerald-500 text-sm"></i>
                  <span className="text-sm text-emerald-600 font-medium">Halal</span>
                </div>
                <span className="text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a href="/menu" className="btn-primary-enhanced px-6 sm:px-8 py-3 rounded-lg font-medium inline-block animate-bounce-subtle" data-testid="link-view-full-menu">
              <i className="fa-solid fa-utensils mr-2"></i>View Full Menu
            </a>
            <a href="/online-order" className="card-enhanced border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-lg font-medium hover:glow-accent transition-all inline-block" data-testid="link-order-online">
              <i className="fa-solid fa-shopping-cart mr-2 animate-spin-slow"></i>Order Online
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}