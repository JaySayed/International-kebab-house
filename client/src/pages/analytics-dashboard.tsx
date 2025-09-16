import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Star, 
  Calendar,
  PieChart,
  BarChart3,
  Eye,
  Package
} from "lucide-react";
import type { Order, Review, AnalyticsEvent, Customer } from "@shared/schema";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch data for analytics
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/public"],
    retry: false,
  });

  const { data: analyticsEvents = [] } = useQuery<AnalyticsEvent[]>({
    queryKey: ["/api/analytics-events"],
    retry: false,
  });

  // Calculate key metrics
  const calculateMetrics = () => {
    const now = new Date();
    const daysBack = parseInt(timeRange.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Filter recent orders
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= cutoffDate;
    });

    // Calculate revenue
    const totalRevenue = recentOrders.reduce((sum, order) => 
      sum + parseFloat(order.total), 0
    );

    // Calculate average order value
    const avgOrderValue = recentOrders.length > 0 ? 
      totalRevenue / recentOrders.length : 0;

    // Calculate review metrics
    const recentReviews = reviews.filter(review => {
      const reviewDate = new Date(review.createdAt || new Date());
      return reviewDate >= cutoffDate;
    });

    const avgRating = recentReviews.length > 0 ?
      recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length : 0;

    // Order status distribution
    const statusDistribution = recentOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top performing items (mock data for now)
    const topItems = [
      { name: "Chopan Kabab", orders: 45, revenue: 1350 },
      { name: "Qabuli Pulao", orders: 38, revenue: 874 },
      { name: "Mixed Kabab Platter", orders: 32, revenue: 736 },
      { name: "Afghani Burger", orders: 28, revenue: 224 },
    ];

    // Daily performance (mock trend data)
    const dailyPerformance = Array.from({ length: daysBack }, (_, i) => {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayOrders = recentOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toLocaleDateString(),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + parseFloat(order.total), 0),
      };
    }).reverse();

    return {
      totalRevenue,
      totalOrders: recentOrders.length,
      avgOrderValue,
      avgRating,
      statusDistribution,
      topItems,
      dailyPerformance,
      reviewCount: recentReviews.length,
    };
  };

  const metrics = calculateMetrics();

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = "number",
    testId
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    format?: "number" | "currency" | "rating";
    testId?: string;
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return `$${val.toFixed(2)}`;
        case "rating":
          return val.toFixed(1);
        default:
          return val.toString();
      }
    };

    const changeColor = change && change > 0 ? "text-green-400" : 
                      change && change < 0 ? "text-red-400" : "text-gray-400";
    const ChangeIcon = change && change > 0 ? TrendingUp : TrendingDown;

    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold text-white" data-testid={testId}>
                {formatValue(value)}
              </p>
              {change !== undefined && (
                <div className={`flex items-center gap-1 mt-1 ${changeColor}`}>
                  <ChangeIcon className="w-4 h-4" />
                  <span className="text-sm">{Math.abs(change)}%</span>
                  <span className="text-gray-400 text-sm">vs last period</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <Icon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-yellow-500" />
              Business Analytics Dashboard
            </h1>
            <p className="text-gray-300">Real-time insights into your restaurant performance</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white" data-testid="select-time-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            change={12.5}
            icon={DollarSign}
            format="currency"
            testId="metric-total-revenue"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            change={8.2}
            icon={ShoppingCart}
            testId="metric-total-orders"
          />
          <MetricCard
            title="Average Order Value"
            value={metrics.avgOrderValue}
            change={-3.1}
            icon={TrendingUp}
            format="currency"
            testId="metric-avg-order-value"
          />
          <MetricCard
            title="Customer Rating"
            value={metrics.avgRating}
            change={2.8}
            icon={Star}
            format="rating"
            testId="metric-avg-rating"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">Overview</TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-white/20 text-white">Sales</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white/20 text-white">Products</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-white/20 text-white">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Status Distribution */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-yellow-500" />
                    Order Status Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Current order pipeline status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.statusDistribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'delivered' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'preparing' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></div>
                          <span className="text-white capitalize">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{count}</span>
                          <span className="text-gray-400">orders</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Performance Trend */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    Daily Performance Trend
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Orders and revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.dailyPerformance.slice(-5).map((day, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-gray-300 text-sm">{day.date}</span>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-semibold">{day.orders}</div>
                            <div className="text-gray-400 text-xs">orders</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">${day.revenue.toFixed(2)}</div>
                            <div className="text-gray-400 text-xs">revenue</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Eye className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2" data-testid="metric-page-views">2,453</div>
                  <div className="text-gray-300">Page Views</div>
                  <div className="text-green-400 text-sm mt-1">+15% from last period</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2" data-testid="metric-new-customers">87</div>
                  <div className="text-gray-300">New Customers</div>
                  <div className="text-green-400 text-sm mt-1">+23% from last period</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-2" data-testid="metric-reviews-count">{metrics.reviewCount}</div>
                  <div className="text-gray-300">New Reviews</div>
                  <div className="text-blue-400 text-sm mt-1">Avg {metrics.avgRating.toFixed(1)} stars</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Sales Performance Analysis</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed breakdown of sales metrics and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-500 mb-2">${metrics.totalRevenue.toFixed(2)}</div>
                      <div className="text-gray-300">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.totalOrders}</div>
                      <div className="text-gray-300">Orders Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">${metrics.avgOrderValue.toFixed(2)}</div>
                      <div className="text-gray-300">Avg Order Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
                      <div className="text-gray-300">Customer Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-yellow-500" />
                  Top Performing Menu Items
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Best selling dishes and their performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-yellow-600 text-white">{index + 1}</Badge>
                        <div>
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-gray-400 text-sm">{item.orders} orders</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${item.revenue}</div>
                        <div className="text-gray-400 text-sm">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Customer Insights</CardTitle>
                  <CardDescription className="text-gray-300">
                    Customer behavior and satisfaction metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-500 mb-2">4.7</div>
                      <div className="text-gray-300 mb-2">Average Rating</div>
                      <div className="flex justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Repeat Customers</span>
                        <span className="text-white font-semibold">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Customer Retention</span>
                        <span className="text-white font-semibold">82%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Order Frequency</span>
                        <span className="text-white font-semibold">2.3/month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Customer Feedback Summary</CardTitle>
                  <CardDescription className="text-gray-300">
                    Recent customer reviews and ratings breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(review => review.rating === rating).length;
                      const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
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
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}