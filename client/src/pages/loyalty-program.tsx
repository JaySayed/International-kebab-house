import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gift, Star, TrendingUp, Award, Crown, Heart, ShoppingBag } from "lucide-react";
import type { Customer, LoyaltyTransaction } from "@shared/schema";

const joinLoyaltySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export default function LoyaltyProgram() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof joinLoyaltySchema>>({
    resolver: zodResolver(joinLoyaltySchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  // Fetch customer by email
  const { data: customer, isLoading: customerLoading } = useQuery<Customer>({
    queryKey: ["/api/customers/email", customerEmail],
    enabled: !!customerEmail,
    retry: false,
  });

  // Fetch loyalty transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<LoyaltyTransaction[]>({
    queryKey: ["/api/loyalty-transactions/customer", customer?.id],
    enabled: !!customer?.id,
  });

  // Join loyalty program mutation
  const joinLoyaltyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof joinLoyaltySchema>) => {
      const response = await apiRequest("POST", "/api/customers", data);
      return response.json();
    },
    onSuccess: (newCustomer: Customer) => {
      toast({
        title: "Welcome to our Loyalty Program!",
        description: `You've earned 100 welcome bonus points! Your balance: ${newCustomer.loyaltyPoints} points`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/email"] });
      setCustomerEmail(newCustomer.email);
      setShowJoinForm(false);
      
      // Create welcome bonus transaction
      apiRequest("POST", "/api/loyalty-transactions", {
        customerId: newCustomer.id,
        points: 100,
        type: "bonus",
        description: "Welcome bonus for joining loyalty program"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join loyalty program. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check customer status
  const handleCustomerLookup = () => {
    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to check your loyalty status.",
        variant: "destructive",
      });
      return;
    }
  };

  const onJoinSubmit = (data: z.infer<typeof joinLoyaltySchema>) => {
    joinLoyaltyMutation.mutate(data);
  };

  // Loyalty rewards tiers
  const loyaltyTiers = [
    { name: "Bronze", minPoints: 0, color: "bg-amber-600", benefits: ["1 point per $1 spent", "Birthday discount"] },
    { name: "Silver", minPoints: 500, color: "bg-gray-400", benefits: ["1.5 points per $1 spent", "Free appetizer monthly", "Priority support"] },
    { name: "Gold", minPoints: 1000, color: "bg-yellow-500", benefits: ["2 points per $1 spent", "Priority service", "Exclusive menu items"] },
    { name: "Platinum", minPoints: 2000, color: "bg-purple-600", benefits: ["3 points per $1 spent", "Personal chef consultation", "VIP events"] },
  ];

  const getCurrentTier = (points: number) => {
    return loyaltyTiers.reverse().find(tier => points >= tier.minPoints) || loyaltyTiers[0];
  };

  const getNextTier = (points: number) => {
    return loyaltyTiers.find(tier => points < tier.minPoints);
  };

  // Available rewards
  const availableRewards = [
    { id: 1, name: "Free Appetizer", points: 200, description: "Any appetizer from our menu", icon: <Heart className="w-6 h-6" /> },
    { id: 2, name: "10% Off Next Order", points: 300, description: "Discount on your entire order", icon: <TrendingUp className="w-6 h-6" /> },
    { id: 3, name: "Free Kabab Entree", points: 500, description: "Choice of any kabab specialty", icon: <ShoppingBag className="w-6 h-6" /> },
    { id: 4, name: "Extra Portion", points: 150, description: "Double portion of rice or bread", icon: <Gift className="w-6 h-6" /> },
    { id: 5, name: "Family Platter Discount", points: 800, description: "20% off any family platter", icon: <Crown className="w-6 h-6" /> },
    { id: 6, name: "Chef's Special Dinner", points: 1000, description: "Exclusive 3-course meal", icon: <Award className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Star className="w-10 h-10 text-yellow-500" />
            Afghan Flavors Loyalty Program
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Earn points with every order and unlock exclusive rewards. Join our loyal community and enjoy the finest Afghan cuisine with amazing benefits!
          </p>
        </div>

        {!customer ? (
          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Check Your Loyalty Status</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your email to view your points and rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    data-testid="input-customer-email"
                  />
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleCustomerLookup}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600"
                    disabled={customerLoading}
                    data-testid="button-check-status"
                  >
                    {customerLoading ? "Checking..." : "Check My Status"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowJoinForm(!showJoinForm)}
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    data-testid="button-join-program"
                  >
                    Join Loyalty Program
                  </Button>
                </div>

                {showJoinForm && (
                  <Card className="bg-white/5 border-white/10 mt-4">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Join Today & Get 100 Points!</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onJoinSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white/10 border-white/20 text-white" data-testid="input-join-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-white/10 border-white/20 text-white" data-testid="input-first-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-white/10 border-white/20 text-white" data-testid="input-last-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white/10 border-white/20 text-white" data-testid="input-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                            disabled={joinLoyaltyMutation.isPending}
                            data-testid="button-submit-join"
                          >
                            {joinLoyaltyMutation.isPending ? "Joining..." : "Join Now & Get 100 Points!"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Customer Status Overview */}
            <Card className="bg-gradient-to-r from-yellow-600/20 to-purple-600/20 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">Welcome, {customer.firstName}!</CardTitle>
                    <CardDescription className="text-gray-300">
                      Member since {new Date(customer.createdAt || new Date()).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-yellow-500" data-testid="text-loyalty-points">{customer.loyaltyPoints || 0}</div>
                    <div className="text-sm text-gray-300">Points Balance</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white" data-testid="text-total-orders">{customer.totalOrders || 0}</div>
                    <div className="text-gray-300">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white" data-testid="text-total-spent">${customer.totalSpent || '0.00'}</div>
                    <div className="text-gray-300">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <Badge className={`${getCurrentTier(customer.loyaltyPoints || 0).color} text-white text-lg py-1 px-3`}>
                      {getCurrentTier(customer.loyaltyPoints || 0).name} Member
                    </Badge>
                  </div>
                </div>

                {/* Progress to next tier */}
                {getNextTier(customer.loyaltyPoints || 0) && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Progress to {getNextTier(customer.loyaltyPoints || 0)?.name}</span>
                      <span>{customer.loyaltyPoints || 0} / {getNextTier(customer.loyaltyPoints || 0)?.minPoints} points</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((customer.loyaltyPoints || 0) / (getNextTier(customer.loyaltyPoints || 0)?.minPoints || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="rewards" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                <TabsTrigger value="rewards" className="data-[state=active]:bg-white/20 text-white">Available Rewards</TabsTrigger>
                <TabsTrigger value="tiers" className="data-[state=active]:bg-white/20 text-white">Membership Tiers</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">Points History</TabsTrigger>
              </TabsList>

              <TabsContent value="rewards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableRewards.map((reward) => (
                    <Card key={reward.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="text-yellow-500">{reward.icon}</div>
                          <div>
                            <CardTitle className="text-white text-lg">{reward.name}</CardTitle>
                            <CardDescription className="text-gray-300">{reward.points} points</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{reward.description}</p>
                        <Button 
                          className="w-full"
                          variant={(customer.loyaltyPoints || 0) >= reward.points ? "default" : "secondary"}
                          disabled={(customer.loyaltyPoints || 0) < reward.points}
                          data-testid={`button-redeem-${reward.id}`}
                        >
                          {(customer.loyaltyPoints || 0) >= reward.points ? "Redeem Reward" : `Need ${reward.points - (customer.loyaltyPoints || 0)} more points`}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tiers" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loyaltyTiers.map((tier) => (
                    <Card 
                      key={tier.name} 
                      className={`bg-white/10 border-white/20 backdrop-blur-sm ${(customer.loyaltyPoints || 0) >= tier.minPoints ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                            {tier.name}
                          </CardTitle>
                          {(customer.loyaltyPoints || 0) >= tier.minPoints && (
                            <Badge className="bg-green-600 text-white">Current</Badge>
                          )}
                        </div>
                        <CardDescription className="text-gray-300">
                          {tier.minPoints} points required
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-gray-300">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-300 mt-2">Loading transaction history...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="text-center py-8">
                      <p className="text-gray-300">No transactions yet. Start earning points with your first order!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction: LoyaltyTransaction) => (
                      <Card key={transaction.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <div className="text-white font-medium">{transaction.description}</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(transaction.createdAt || new Date()).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${transaction.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.points > 0 ? '+' : ''}{transaction.points} points
                            </div>
                            <Badge variant="outline" className="border-gray-500 text-gray-400">
                              {transaction.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}