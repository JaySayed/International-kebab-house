import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import LanguageProvider from "@/providers/LanguageProvider";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import OnlineOrder from "@/pages/online-order";
import AboutUs from "@/pages/about-us";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import OrderSuccess from "@/pages/order-success";
import LoyaltyProgram from "@/pages/loyalty-program";
import Catering from "@/pages/catering";
import Reviews from "@/pages/reviews";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import RestaurantDashboard from "@/pages/restaurant-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/online-order" component={OnlineOrder} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/contact" component={Contact} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-success" component={OrderSuccess} />
        <Route path="/loyalty-program" component={LoyaltyProgram} />
        <Route path="/catering" component={Catering} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/restaurant" component={RestaurantDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
