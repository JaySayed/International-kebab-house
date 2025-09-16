import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate newsletter signup
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter! Check your email for exclusive offers.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="newsletter-glow card-enhanced p-6 sm:p-8 rounded-xl">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4 animate-float">📧 Stay Updated with Our Latest Offers</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter and get exclusive deals, new menu updates, and special event notifications delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              required
              data-testid="input-newsletter-email"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary-enhanced px-6 py-3 rounded-lg font-medium disabled:opacity-50"
              data-testid="button-newsletter-subscribe"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-envelope mr-2"></i>Subscribe
                </>
              )}
            </button>
          </form>
          
          <p className="text-sm text-muted-foreground mt-4">
            <i className="fa-solid fa-shield-alt mr-1"></i>
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}