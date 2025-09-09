import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SimpleBarChart, SimpleLineChart } from '@/components/SimpleChart';
import { TrendingUp, Users, MousePointer, Eye, DollarSign, Calendar, IndianRupee } from 'lucide-react';

// API endpoint
const API_ENDPOINT = 'https://api.onestepmedi.com:8000/dm-leads/leads/DR201';

// Get auth token from localStorage
const token = localStorage.getItem('authToken');

// StatCard component
const StatCard = ({ title, value, change, trend, icon: Icon }) => {
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINT, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, []);

  // Derived metrics
  const totalLeads = data.reduce((sum, item) => sum + item.Leads, 0);
  const totalConversions = data.reduce((sum, item) => sum + item['Sales Closed'], 0);
  const conversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : 0;
  const totalImpressions = data.reduce((sum, item) => sum + item.Impressions, 0);
  const totalClicks = data.reduce((sum, item) => sum + item.Clicks, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item['Revenue (₹)'], 0);
  const totalSpend = data.reduce((sum, item) => sum + item['Spend (₹)'], 0);
  const avgROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : 0;
  const totalQualifiedLeads = data.reduce((sum, item) => sum + item['Qualified Leads'], 0);
  const avgCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : 0;

  // Lead analytics data (daily)
  const leadAnalyticsData = data.map((item, index) => {
    const date = new Date(item.Date);
    const dayAbbr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      day: dayAbbr,
      leads: item.Leads,
      conversions: item['Sales Closed'],
      revenue: item['Revenue (₹)']
    };
  });

  // Weekly analytics data (adapted to daily since data spans 5 days)
  const weeklyAnalyticsData = data.map((item, index) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const day = dayNames[index] || 'Mon';
    return {
      day,
      visitors: item.Impressions,
      clicks: item.Clicks,
      appointments: item['Qualified Leads']
    };
  });

  // Lead sources
  const googleLeads = data.reduce((sum, item) => sum + (item.Platform === 'Google Ads' ? item.Leads : 0), 0);
  const metaLeads = data.reduce((sum, item) => sum + (item.Platform.includes('Meta') ? item.Leads : 0), 0);
  const total = totalLeads;
  const referralsLeads = total - googleLeads - metaLeads; // 0 in this data

  // Weekly summary metrics
  const weeklyVisitors = totalImpressions;
  const weeklyClicks = totalClicks;
  const weeklyAppointments = totalConversions;
  const weeklyConvRate = totalClicks > 0 ? ((weeklyAppointments / totalClicks) * 100).toFixed(1) : 0;

  if (loading) {
    return <div className="space-y-6">Loading Digital Marketing data...</div>;
  }

  if (error) {
    return <div className="space-y-6">Error loading data: {error}</div>;
  }

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
          value={totalLeads.toLocaleString()}
          change="vs last period"
          trend={12.5}
          icon={Users}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change="vs last period"
          trend={3.2}
          icon={MousePointer}
        />
        <StatCard
          title="Website Traffic"
          value={totalImpressions.toLocaleString()}
          change="vs last week"
          trend={8.4}
          icon={Eye}
        />
        <StatCard
          title="Revenue Generated"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="vs last period"
          trend={8.7}
          icon={DollarSign}
        />
        <StatCard
          title="Total Spend"
          value={`₹${totalSpend.toLocaleString()}`}
          change="vs last period"
          trend={5.0}
          icon={IndianRupee}
        />
        <StatCard
          title="Qualified Leads"
          value={totalQualifiedLeads.toLocaleString()}
          change="vs last period"
          trend={7.8}
          icon={Users}
        />
        <StatCard
          title="Cost Per Lead"
          value={`₹${avgCPL}`}
          change="vs last period"
          trend={4.2}
          icon={IndianRupee}
        />
        <StatCard
          title="ROAS"
          value={avgROAS}
          change="vs last period"
          trend={6.5}
          icon={TrendingUp}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card shadow-card-medical">
          <TabsTrigger value="leads" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Lead Analytics
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Daily Analytics
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
                <CardDescription>Daily lead acquisition and conversion rates</CardDescription>
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
                <CardDescription>Daily revenue from new patient acquisitions</CardDescription>
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
                  <p className="text-2xl font-bold text-foreground">{googleLeads} leads</p>
                  <p className="text-sm text-muted-foreground">{((googleLeads / totalLeads) * 100).toFixed(0)}% of total</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <h3 className="font-semibold text-success">Meta Ads</h3>
                  <p className="text-2xl font-bold text-foreground">{metaLeads} leads</p>
                  <p className="text-sm text-muted-foreground">{((metaLeads / totalLeads) * 100).toFixed(0)}% of total</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <h3 className="font-semibold text-purple-600">Referrals</h3>
                  <p className="text-2xl font-bold text-foreground">{referralsLeads} leads</p>
                  <p className="text-sm text-muted-foreground">{((referralsLeads / totalLeads) * 100).toFixed(0)}% of total</p>
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
                  Daily Website Traffic
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
                  Qualified Leads
                </CardTitle>
                <CardDescription>Daily qualified lead trends</CardDescription>
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

          {/* Daily Summary */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle>Daily Performance Summary</CardTitle>
              <CardDescription>Key metrics for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-3xl font-bold text-primary">{weeklyVisitors.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Impressions</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-3xl font-bold text-success">{weeklyClicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <p className="text-3xl font-bold text-warning">{weeklyAppointments}</p>
                  <p className="text-sm text-muted-foreground">Sales Closed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-3xl font-bold text-accent">{weeklyConvRate}%</p>
                  <p className="text-sm text-muted-foreground">Click-to-Sale Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};