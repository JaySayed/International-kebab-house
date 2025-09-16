import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, ThumbsUp, Filter, Search, Award } from "lucide-react";
import type { Review, MenuItem } from "@shared/schema";

const reviewSchema = z.object({
  customerId: z.number().min(1, "Customer ID is required"),
  menuItemId: z.number().min(1, "Please select a menu item"),
  rating: z.number().min(1, "Please select a rating").max(5, "Rating cannot exceed 5 stars"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  comment: z.string().min(10, "Review must be at least 10 characters").max(500, "Review too long"),
});

const customerLookupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function Reviews() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { toast } = useToast();

  const customerForm = useForm<z.infer<typeof customerLookupSchema>>({
    resolver: zodResolver(customerLookupSchema),
    defaultValues: { email: "" },
  });

  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerId: 0,
      menuItemId: 0,
      rating: 5,
      title: "",
      comment: "",
    },
  });

  // Fetch all menu items for review selection
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Fetch public reviews
  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews/public"],
  });

  // Find customer mutation
  const findCustomerMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("GET", `/api/customers/email/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error("Customer not found");
      }
      return response.json();
    },
    onSuccess: (customer) => {
      setSelectedCustomer(customer);
      reviewForm.setValue("customerId", customer.id);
      toast({
        title: "Customer Found",
        description: `Welcome back, ${customer.firstName}! You can now leave a review.`,
      });
    },
    onError: () => {
      setSelectedCustomer(null);
      toast({
        title: "Customer Not Found",
        description: "Please check your email address or sign up for our loyalty program first.",
        variant: "destructive",
      });
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewSchema>) => {
      const response = await apiRequest("POST", "/api/reviews", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review will be published shortly.",
      });
      reviewForm.reset();
      setSelectedCustomer(null);
      setCustomerEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/public"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter reviews based on selected filters
  const filteredReviews = allReviews.filter((review) => {
    const matchesCategory = selectedCategory === "all" || 
      menuItems.find(item => item.id === review.menuItemId)?.category === selectedCategory;
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating;
    const matchesSearch = searchTerm === "" || 
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRating && matchesSearch;
  });

  // Get unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  // Calculate review statistics
  const reviewStats = {
    total: allReviews.length,
    average: allReviews.length > 0 ? 
      (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1) : "0.0",
    distribution: [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: allReviews.filter(review => review.rating === rating).length,
      percentage: allReviews.length > 0 ? 
        Math.round((allReviews.filter(review => review.rating === rating).length / allReviews.length) * 100) : 0
    }))
  };

  const onCustomerLookup = (data: z.infer<typeof customerLookupSchema>) => {
    setCustomerEmail(data.email);
    findCustomerMutation.mutate(data.email);
  };

  const onReviewSubmit = (data: z.infer<typeof reviewSchema>) => {
    submitReviewMutation.mutate(data);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5", 
      lg: "w-6 h-6"
    };
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="w-10 h-10 text-yellow-500" />
            Customer Reviews & Feedback
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Share your dining experience and read what other customers are saying about our authentic Afghan cuisine
          </p>
        </div>

        {/* Review Statistics */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Overall Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2" data-testid="text-average-rating">{reviewStats.average}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(parseFloat(reviewStats.average)), "lg")}
                </div>
                <div className="text-gray-300">Average Rating</div>
                <div className="text-gray-400 text-sm">Based on {reviewStats.total} reviews</div>
              </div>
              
              <div className="space-y-2">
                {reviewStats.distribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-white w-8">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-sm w-12">{count}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                <div className="text-white font-semibold">Verified Reviews</div>
                <div className="text-gray-400 text-sm">From real customers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="browse" className="data-[state=active]:bg-white/20 text-white">Browse Reviews</TabsTrigger>
            <TabsTrigger value="write" className="data-[state=active]:bg-white/20 text-white">Write a Review</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Search Reviews</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white"
                        data-testid="input-search-reviews"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-category-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Rating</label>
                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-rating-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-gray-300 mt-2">Loading reviews...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No reviews found matching your criteria.</p>
                    <Button 
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedRating("all");
                        setSearchTerm("");
                      }}
                      variant="outline"
                      className="mt-4 border-white/20 text-white hover:bg-white/10"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredReviews.map((review) => {
                  const menuItem = menuItems.find(item => item.id === review.menuItemId);
                  return (
                    <Card key={review.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {renderStars(review.rating)}
                              <Badge variant="outline" className="border-gray-500 text-gray-300">
                                {menuItem?.name || "Menu Item"}
                              </Badge>
                              <Badge variant="outline" className="border-gray-500 text-gray-300">
                                {menuItem?.category || "Category"}
                              </Badge>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">{review.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-white/10" />
                        
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-4">
                            {review.isVerifiedPurchase && (
                              <Badge className="bg-green-600 text-white">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                            <span>Posted {new Date(review.createdAt || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="write" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Share Your Experience</CardTitle>
                  <CardDescription className="text-gray-300">
                    Help other customers by sharing your honest feedback about our food and service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Lookup */}
                  {!selectedCustomer && (
                    <div>
                      <Form {...customerForm}>
                        <form onSubmit={customerForm.handleSubmit(onCustomerLookup)} className="space-y-4">
                          <FormField
                            control={customerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Your Email Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="email" 
                                    placeholder="Enter the email used for your orders"
                                    className="bg-white/10 border-white/20 text-white" 
                                    data-testid="input-customer-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600"
                            disabled={findCustomerMutation.isPending}
                            data-testid="button-find-customer"
                          >
                            {findCustomerMutation.isPending ? "Looking up..." : "Find My Account"}
                          </Button>
                        </form>
                      </Form>
                      <p className="text-gray-400 text-sm mt-2">
                        Need to create an account? Visit our <a href="/loyalty-program" className="text-yellow-500 hover:underline">Loyalty Program</a> page to sign up.
                      </p>
                    </div>
                  )}

                  {/* Review Form */}
                  {selectedCustomer && (
                    <div>
                      <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-6">
                        <p className="text-green-200">
                          Welcome, {selectedCustomer.firstName}! You're logged in and ready to leave a review.
                        </p>
                      </div>

                      <Form {...reviewForm}>
                        <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-6">
                          <FormField
                            control={reviewForm.control}
                            name="menuItemId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Which dish are you reviewing?</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-menu-item">
                                      <SelectValue placeholder="Select a menu item" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {menuItems.map((item) => (
                                      <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name} - {item.category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={reviewForm.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Overall Rating</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => field.onChange(star)}
                                        className="p-1 rounded"
                                        data-testid={`button-rating-${star}`}
                                      >
                                        <Star
                                          className={`w-8 h-8 ${
                                            star <= field.value ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                                          } hover:text-yellow-400 transition-colors`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={reviewForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Review Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Sum up your experience in a few words"
                                    className="bg-white/10 border-white/20 text-white" 
                                    data-testid="input-review-title"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={reviewForm.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Your Review</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Share details about your experience, food quality, service, atmosphere, etc."
                                    className="bg-white/10 border-white/20 text-white min-h-[120px]" 
                                    data-testid="textarea-review-comment"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-4">
                            <Button 
                              type="submit" 
                              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                              disabled={submitReviewMutation.isPending}
                              data-testid="button-submit-review"
                            >
                              {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setSelectedCustomer(null);
                                reviewForm.reset();
                                setCustomerEmail("");
                              }}
                              className="border-white/20 text-white hover:bg-white/10"
                              data-testid="button-cancel-review"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}