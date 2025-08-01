import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SimpleBarChart, SimpleLineChart } from '@/components/SimpleChart';
import { TrendingUp, Users, MousePointer, Eye, DollarSign, Calendar } from 'lucide-react';

// Mock data for analytics
const leadAnalyticsData = [
  { month: 'Jan', leads: 45, conversions: 12, revenue: 2400 },
  { month: 'Feb', leads: 52, conversions: 18, revenue: 3200 },
  { month: 'Mar', leads: 61, conversions: 22, revenue: 4100 },
  { month: 'Apr', leads: 38, conversions: 15, revenue: 2800 },
  { month: 'May', leads: 75, conversions: 28, revenue: 5200 },
  { month: 'Jun', leads: 84, conversions: 32, revenue: 6100 },
];

const weeklyAnalyticsData = [
  { day: 'Mon', visitors: 120, clicks: 45, appointments: 8 },
  { day: 'Tue', visitors: 98, clicks: 38, appointments: 6 },
  { day: 'Wed', visitors: 145, clicks: 62, appointments: 12 },
  { day: 'Thu', visitors: 167, clicks: 71, appointments: 15 },
  { day: 'Fri', visitors: 189, clicks: 84, appointments: 18 },
  { day: 'Sat', visitors: 76, clicks: 28, appointments: 4 },
  { day: 'Sun', visitors: 54, clicks: 18, appointments: 3 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => {
  const isPositive = trend > 0;
  
  return (
    <Card className="shadow-card-medical hover:shadow-medical transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                {isPositive ? '+' : ''}{trend}%
              </Badge>
              <span className="text-xs text-muted-foreground">{change}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DigitalMarketing = () => {
  const [activeTab, setActiveTab] = useState('leads');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Digital Marketing</h1>
        <p className="text-muted-foreground">Track your marketing performance and analytics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value="355"
          change="vs last month"
          trend={12.5}
          icon={Users}
        />
        <StatCard
          title="Conversion Rate"
          value="18.5%"
          change="vs last month"
          trend={3.2}
          icon={MousePointer}
        />
        <StatCard
          title="Website Views"
          value="2,849"
          change="vs last week"
          trend={-2.1}
          icon={Eye}
        />
        <StatCard
          title="Revenue"
          value="$23,800"
          change="vs last month"
          trend={8.7}
          icon={DollarSign}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card shadow-card-medical">
          <TabsTrigger value="leads" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Lead Analytics
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Weekly Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Lead Generation Trends
                </CardTitle>
                <CardDescription>Monthly lead acquisition and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={leadAnalyticsData}
                  bars={[
                    { dataKey: "leads", fill: "hsl(210 100% 50%)" },
                    { dataKey: "conversions", fill: "hsl(142 76% 36%)" }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  Revenue Growth
                </CardTitle>
                <CardDescription>Monthly revenue from new patient acquisitions</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={leadAnalyticsData}
                  lines={[
                    { dataKey: "revenue", stroke: "hsl(142 76% 36%)" }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Lead Sources */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle>Lead Sources Performance</CardTitle>
              <CardDescription>Performance breakdown by acquisition channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <h3 className="font-semibold text-primary">Google Ads</h3>
                  <p className="text-2xl font-bold text-foreground">142 leads</p>
                  <p className="text-sm text-muted-foreground">40% of total</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <h3 className="font-semibold text-success">Social Media</h3>
                  <p className="text-2xl font-bold text-foreground">89 leads</p>
                  <p className="text-sm text-muted-foreground">25% of total</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <h3 className="font-semibold text-purple-600">Referrals</h3>
                  <p className="text-2xl font-bold text-foreground">124 leads</p>
                  <p className="text-sm text-muted-foreground">35% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Website Traffic
                </CardTitle>
                <CardDescription>Daily visitor count and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={weeklyAnalyticsData}
                  bars={[
                    { dataKey: "visitors", fill: "hsl(210 100% 50%)" },
                    { dataKey: "clicks", fill: "hsl(142 76% 36%)" }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  Appointment Bookings
                </CardTitle>
                <CardDescription>Daily appointment booking trends</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={weeklyAnalyticsData}
                  lines={[
                    { dataKey: "appointments", stroke: "hsl(142 76% 36%)" }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle>Weekly Performance Summary</CardTitle>
              <CardDescription>Key metrics for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-3xl font-bold text-primary">849</p>
                  <p className="text-sm text-muted-foreground">Total Visitors</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-3xl font-bold text-success">346</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <p className="text-3xl font-bold text-warning">66</p>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-3xl font-bold text-accent">19.1%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};