import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Colors for pie chart
const COLORS = ['hsl(210 100% 50%)', 'hsl(142 76% 36%)', 'hsl(340 82% 52%)', 'hsl(48 89% 50%)'];

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <Card className="shadow-card-medical hover:shadow-medical transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility to decode JWT token (copied from Profile.tsx)
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const DoctorsDashboard = () => {  // Removed doctor_id prop
  const { user, logout } = useAuth();  // Added user for token
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('monthly');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract fetchData as useCallback to avoid deps issues
  const fetchData = useCallback(async () => {
    console.log('fetchData called'); // Debug log (removed doctor_id since derived)
    const token = localStorage.getItem('authToken');
    if (!token || !user?.token) {
      const errMsg = 'No authentication token found. Please log in again.';
      setError(errMsg);
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
      logout();
      setLoading(false);
      return;
    }

    // Decode token to get doctor_id (from Profile.tsx logic)
    const decodedToken = decodeToken(token || user.token);
    const doctorId = decodedToken?.id;
    if (!doctorId) {
      const errMsg = 'Invalid token or doctor ID not found. Please log in again.';
      setError(errMsg);
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
      logout();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching from API with doctor_id:', doctorId); // Debug
      const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch data: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      console.log('API Data received:', data); // Debug: Check structure
      setApiData(data);
      setError(null);
    } catch (err) {
      const errMsg = err.message;
      console.error('Fetch error:', errMsg); // Debug
      setError(errMsg);
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
      if (errMsg === 'Session expired') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout, toast]); // Added user to deps

  useEffect(() => {
    if (user?.token) {  // Check for token instead of doctor_id prop
      fetchData();
    } else {
      setLoading(false);
      setError('Authentication required. Please log in.');
    }
  }, [fetchData]); // Depend on fetchData

  // Prepare data for consultation type breakdown (with fallback)
  const consultationTypeData = apiData?.breakdowns?.normal_breakdown_by_type
    ? [
        { name: 'Virtual', value: apiData.breakdowns.normal_breakdown_by_type.virtual || 0 },
        { name: 'Home Visit', value: apiData.breakdowns.normal_breakdown_by_type.home_visit || 0 },
        { name: 'Clinic Visit', value: apiData.breakdowns.normal_breakdown_by_type.clinic_visit || 0 },
        { name: 'Other', value: apiData.breakdowns.normal_breakdown_by_type.other || 0 },
      ].filter(item => item.value > 0).length > 0
      ? [
          { name: 'Virtual', value: apiData.breakdowns.normal_breakdown_by_type.virtual || 0 },
          { name: 'Home Visit', value: apiData.breakdowns.normal_breakdown_by_type.home_visit || 0 },
          { name: 'Clinic Visit', value: apiData.breakdowns.normal_breakdown_by_type.clinic_visit || 0 },
          { name: 'Other', value: apiData.breakdowns.normal_breakdown_by_type.other || 0 },
        ].filter(item => item.value > 0)
      : [{ name: 'No Data', value: 1 }]
    : [{ name: 'No Data', value: 1 }];

  if (loading) {
    console.log('Rendering loading...'); // Debug: Confirm this logs
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div> {/* Spinner for visibility */}
          <p className="text-lg font-medium text-foreground">Loading Dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Fetching your analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2">
              <button 
                onClick={fetchData}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
              <button 
                onClick={logout}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Logout
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!apiData || !user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No data available. Please ensure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-10xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Doctors Dashboard</h1>
        <p className="text-muted-foreground">Track your performance and analytics for {apiData.summary.doctor_name} ({apiData.summary.specialization.specialization_name})</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Appointments"
          value={apiData.summary.total_appointments.toLocaleString('en-IN')}
          icon={Users}
        />
        <StatCard
          title="Revenue via One Step Medi"
          value={`₹${apiData.summary.total_payment_expected.toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Amount Transferred"
          value={`₹${apiData.summary.amount_transferred.toLocaleString('en-IN')}`}
          icon={Clock}
        />
        <StatCard
          title="Amount Due"
          value={`₹${apiData.summary.amount_due.toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card shadow-card-medical">
          <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Weekly Analytics
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Monthly Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Weekly Appointment Trends
                </CardTitle>
                <CardDescription>Weekly appointment and revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(!apiData.breakdowns?.weekly || apiData.breakdowns.weekly.length === 0) ? (
                  <div className="p-6 text-center text-muted-foreground">No weekly data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={apiData.breakdowns.weekly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="normal" fill="hsl(210 100% 50%)" name="Normal Appointments" />
                      <Bar dataKey="emergency" fill="hsl(142 76% 36%)" name="Emergency Appointments" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  Weekly Revenue Growth
                </CardTitle>
                <CardDescription>Weekly revenue from appointments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(!apiData.breakdowns?.weekly || apiData.breakdowns.weekly.length === 0) ? (
                  <div className="p-6 text-center text-muted-foreground">No weekly data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={apiData.breakdowns.weekly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="hsl(142 76% 36%)" name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Monthly Appointment Trends
                </CardTitle>
                <CardDescription>Monthly appointment and revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(!apiData.breakdowns?.monthly || apiData.breakdowns.monthly.length === 0) ? (
                  <div className="p-6 text-center text-muted-foreground">No monthly data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={apiData.breakdowns.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="normal" fill="hsl(210 100% 50%)" name="Normal Appointments" />
                      <Bar dataKey="emergency" fill="hsl(142 76% 36%)" name="Emergency Appointments" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  Monthly Revenue Growth
                </CardTitle>
                <CardDescription>Monthly revenue from appointments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {(!apiData.breakdowns?.monthly || apiData.breakdowns.monthly.length === 0) ? (
                  <div className="p-6 text-center text-muted-foreground">No monthly data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={apiData.breakdowns.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="hsl(142 76% 36%)" name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  Consultation Type Breakdown
                </CardTitle>
                <CardDescription>Revenue by consultation type</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={consultationTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => {
                        const formattedPercent = (percent * 100).toFixed(0);
                        return formattedPercent > 5 ? `${name} ${formattedPercent}%` : '';
                      }}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={false}
                    >
                      {consultationTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};