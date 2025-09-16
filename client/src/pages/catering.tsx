import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, Clock, CheckCircle, Star, Utensils, Award } from "lucide-react";

const cateringOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  guestCount: z.number().min(5, "Minimum 5 guests for catering").max(500, "Please contact us for events over 500 guests"),
  cateringOption: z.string().min(1, "Please select a catering option"),
  specialRequests: z.string().optional(),
});

export default function Catering() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof cateringOrderSchema>>({
    resolver: zodResolver(cateringOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      eventDate: "",
      eventTime: "",
      guestCount: 10,
      cateringOption: "",
      specialRequests: "",
    },
  });

  const cateringMutation = useMutation({
    mutationFn: async (data: z.infer<typeof cateringOrderSchema>) => {
      const response = await apiRequest("POST", "/api/catering-orders", {
        ...data,
        total: getCateringPrice(data.cateringOption, data.guestCount),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Catering Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your order and discuss details.",
      });
      form.reset();
      setSelectedOption("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit catering request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cateringOptions = [
    {
      id: "option1",
      name: "Essential Afghan Feast",
      description: "Perfect for corporate events and casual gatherings",
      pricePerPerson: 18,
      items: [
        "Mixed Kabab Platter (Chicken, Beef, Lamb)",
        "Qabuli Pulao (Traditional Afghan Rice)",
        "Fresh Naan Bread",
        "Seasonal Vegetables",
        "Afghan Salad",
        "Baklava Dessert"
      ],
      minGuests: 5,
      features: ["Setup included", "Disposable serving ware", "2-hour service"]
    },
    {
      id: "option2", 
      name: "Premium Afghan Experience",
      description: "Elevated dining for special celebrations and events",
      pricePerPerson: 28,
      items: [
        "Signature Kabab Selection (5 varieties)",
        "Lamb Karahi",
        "Uzbeki Pulao with tender lamb",
        "Afghani Mantu (Steamed dumplings)",
        "Ashak (Leek dumplings)",
        "Premium Naan & Bolany",
        "Traditional Afghan desserts",
        "Cardamom Tea service"
      ],
      minGuests: 10,
      features: ["Professional setup", "Real plates & utensils", "3-hour service", "Dedicated server"]
    },
    {
      id: "option3",
      name: "Royal Afghan Banquet", 
      description: "Ultimate luxury dining experience for VIP events",
      pricePerPerson: 45,
      items: [
        "Chef's Selection of Premium Kababs",
        "Whole Roasted Lamb Shoulder",
        "Royal Qabuli Pulao",
        "Gourmet Karahi dishes",
        "Traditional Afghan appetizer spread",
        "Artisan bread selection",
        "Premium Afghan sweets",
        "Traditional tea ceremony",
        "Live cooking demonstration"
      ],
      minGuests: 20,
      features: ["White-glove service", "Premium tableware", "Professional staff", "Custom menu options", "Event coordination"]
    },
    {
      id: "custom",
      name: "Custom Catering Package",
      description: "Tailored specifically to your event needs and preferences",
      pricePerPerson: 0, // Will be quoted
      items: [
        "Customized menu selection",
        "Accommodates dietary restrictions",
        "Flexible serving options",
        "Personalized service level"
      ],
      minGuests: 5,
      features: ["Consultation included", "Custom pricing", "Flexible arrangements"]
    }
  ];

  const getCateringPrice = (option: string, guestCount: number) => {
    const selected = cateringOptions.find(opt => opt.id === option);
    if (!selected || selected.id === "custom") return "0.00";
    return (selected.pricePerPerson * guestCount).toFixed(2);
  };

  const onSubmit = (data: z.infer<typeof cateringOrderSchema>) => {
    cateringMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Utensils className="w-10 h-10 text-yellow-500" />
            Premium Afghan Catering Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Bring the authentic flavors of Afghanistan to your special events. From intimate gatherings to grand celebrations, we create unforgettable culinary experiences.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="text-white font-semibold">5-500 Guests</h3>
              <p className="text-gray-400 text-sm">Any event size</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="text-white font-semibold">Authentic Recipes</h3>
              <p className="text-gray-400 text-sm">Traditional Afghan cuisine</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="text-white font-semibold">Full Service</h3>
              <p className="text-gray-400 text-sm">Setup to cleanup</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="text-white font-semibold">24hr Notice</h3>
              <p className="text-gray-400 text-sm">Quick turnaround</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Catering Options */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Catering Package</h2>
            
            {cateringOptions.map((option) => (
              <Card 
                key={option.id} 
                className={`bg-white/10 border-white/20 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/15 ${
                  selectedOption === option.id ? 'ring-2 ring-yellow-500 bg-white/15' : ''
                }`}
                onClick={() => {
                  setSelectedOption(option.id);
                  form.setValue("cateringOption", option.id);
                }}
                data-testid={`card-catering-${option.id}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {option.name}
                        {option.id === "option3" && <Star className="w-5 h-5 text-yellow-500" />}
                      </CardTitle>
                      <CardDescription className="text-gray-300">{option.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      {option.pricePerPerson > 0 ? (
                        <>
                          <div className="text-2xl font-bold text-yellow-500">${option.pricePerPerson}</div>
                          <div className="text-sm text-gray-400">per person</div>
                        </>
                      ) : (
                        <Badge className="bg-purple-600 text-white">Custom Quote</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Includes:</h4>
                      <ul className="grid grid-cols-1 gap-1 text-gray-300 text-sm">
                        {option.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Service Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {option.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-gray-500 text-gray-300">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      Minimum {option.minGuests} guests
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Form */}
          <div className="lg:sticky lg:top-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Book Your Catering Event</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill out the details and we'll confirm your order within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/10 border-white/20 text-white" data-testid="input-customer-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="bg-white/10 border-white/20 text-white" data-testid="input-customer-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" className="bg-white/10 border-white/20 text-white" data-testid="input-customer-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Event Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" className="bg-white/10 border-white/20 text-white" data-testid="input-event-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eventTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Event Time</FormLabel>
                            <FormControl>
                              <Input {...field} type="time" className="bg-white/10 border-white/20 text-white" data-testid="input-event-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Number of Guests</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="5" 
                              max="500"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-white/10 border-white/20 text-white" 
                              data-testid="input-guest-count"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cateringOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Catering Package</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-catering-option">
                                <SelectValue placeholder="Select a catering package" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cateringOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Dietary restrictions, special arrangements, etc."
                              className="bg-white/10 border-white/20 text-white min-h-[80px]" 
                              data-testid="textarea-special-requests"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Estimate */}
                    {selectedOption && form.watch("guestCount") && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Estimated Total:</span>
                          <span className="text-2xl font-bold text-yellow-500" data-testid="text-estimated-total">
                            {selectedOption === "custom" 
                              ? "Custom Quote" 
                              : `$${getCateringPrice(selectedOption, form.watch("guestCount"))}`
                            }
                          </span>
                        </div>
                        {selectedOption !== "custom" && (
                          <p className="text-gray-400 text-sm mt-2">
                            Final price may vary based on specific requirements and location
                          </p>
                        )}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold"
                      disabled={cateringMutation.isPending || !selectedOption}
                      data-testid="button-submit-catering"
                    >
                      {cateringMutation.isPending ? "Submitting..." : "Submit Catering Request"}
                    </Button>

                    <p className="text-gray-400 text-sm text-center">
                      We'll contact you within 24 hours to confirm details and pricing
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}