'use client';

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoImage from '@assets/IMG_0247_1753076429818.jpeg';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", {
        ...data,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <img 
          src={logoImage} 
          alt="International Kabab House Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-full object-cover border-4 border-primary/20"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">Get in touch with International Kabab House</p>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-certificate text-emerald-500"></i>
            <span className="text-emerald-600 font-medium">100% Halal Certified</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Stone Mountain, GA</span>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Location Card */}
        <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fa-solid fa-location-dot text-primary-foreground text-xl"></i>
          </div>
          <h3 className="text-xl font-bold text-primary mb-4">Our Location</h3>
          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium">6045 Memorial Dr, Ste 15</p>
            <p>Stone Mountain, GA 30083</p>
          </div>
          <button className="mt-4 bg-primary/10 text-primary font-medium border border-primary/20 px-6 py-2 rounded-lg hover:bg-primary/20 transition-all duration-300">
            <i className="fa-solid fa-directions mr-2"></i>Get Directions
          </button>
        </div>

        {/* Operating Hours Card */}
        <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fa-solid fa-clock text-primary-foreground text-xl"></i>
          </div>
          <h3 className="text-xl font-bold text-primary mb-4">Operating Hours</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tuesday - Sunday</span>
              <span className="font-medium text-foreground">11:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-destructive/10 rounded-lg">
              <span className="text-destructive font-medium">Monday</span>
              <span className="text-destructive font-medium">CLOSED</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Hours may vary on holidays
          </p>
        </div>

        {/* Contact Methods Card */}
        <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fa-solid fa-phone text-primary-foreground text-xl"></i>
          </div>
          <h3 className="text-xl font-bold text-primary mb-4">Contact Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <i className="fa-solid fa-phone text-primary"></i>
              <a href="tel:(470) 990-6345" className="text-foreground hover:text-primary transition-colors font-medium">
                (470) 990-6345
              </a>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <i className="fa-solid fa-envelope text-primary"></i>
              <a href="mailto:internationalkababhouse@gmail.com" className="text-foreground hover:text-primary transition-colors">
                internationalkababhouse@gmail.com
              </a>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-border">
              <i className="fa-brands fa-facebook text-primary text-xl cursor-pointer hover:text-primary/80 transition-colors"></i>
              <i className="fa-brands fa-instagram text-primary text-xl cursor-pointer hover:text-primary/80 transition-colors"></i>
              <i className="fa-brands fa-yelp text-primary text-xl cursor-pointer hover:text-primary/80 transition-colors"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mb-16 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Ready to Order?</h2>
        <p className="text-muted-foreground mb-6">Experience authentic Afghan cuisine from the comfort of your home</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/online-order" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 inline-block">
            <i className="fa-solid fa-shopping-cart mr-2"></i>Order Online
          </a>
          <a href="tel:(470) 990-6345" className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/10 transition-all duration-300 inline-block">
            <i className="fa-solid fa-phone mr-2"></i>Call for Pickup
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Send us a Message</h2>
          <p className="text-muted-foreground">We'd love to hear from you! Send us any questions or feedback.</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea 
                rows={5} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Tell us about your experience, ask questions, or share feedback..."
              ></textarea>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}