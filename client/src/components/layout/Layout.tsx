import Header from "./Header";
import Sidebar from "./Sidebar";
import SpecialOffersBar from '@/components/SpecialOffersBar';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import SocialMediaIntegration from '@/components/SocialMediaIntegration';
import LiveChat from '@/components/LiveChat';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import EmailAutomation from '@/components/EmailAutomation';
import ServiceWorker from '@/components/ServiceWorker';
import SecurityHeaders from '@/components/SecurityHeaders';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';
import InstallPrompt from '@/components/InstallPrompt';
import AdvancedCaching from '@/components/AdvancedCaching';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-restaurant-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <SpecialOffersBar />
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Enhanced Features */}
      <SocialMediaIntegration />
      <FloatingActionButtons />
      <LiveChat />
      
      {/* Background Services */}
      <AdvancedAnalytics />
      <EmailAutomation />
      <ServiceWorker />
      <SecurityHeaders />
      <PerformanceOptimizer />
      <AdvancedCaching />
      
      {/* User Prompts */}
      <InstallPrompt />
    </div>
  );
}
