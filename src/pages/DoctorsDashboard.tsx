<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Users, MessageSquare, DollarSign, Clock, CheckCircle, Calendar, Activity, 
  TrendingUp, AlertCircle, FileText, HeartPulse, Stethoscope, ClipboardList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const leadData = [
  { month: 'Jan', leads: 45, conversions: 10, dropouts: 5 },
  { month: 'Feb', leads: 52, conversions: 18, dropouts: 7 },
  { month: 'Mar', leads: 60, conversions: 20, dropouts: 8 },
  { month: 'Apr', leads: 35, conversions: 14, dropouts: 4 },
  { month: 'May', leads: 70, conversions: 25, dropouts: 10 },
  { month: 'Jun', leads: 80, conversions: 30, dropouts: 12 },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 2000, expenses: 1200, profit: 800 },
  { month: 'Feb', revenue: 3000, expenses: 1500, profit: 1500 },
  { month: 'Mar', revenue: 4500, expenses: 2000, profit: 2500 },
  { month: 'Apr', revenue: 2800, expenses: 1800, profit: 1000 },
  { month: 'May', revenue: 6200, expenses: 2500, profit: 3700 },
  { month: 'Jun', revenue: 71000, expenses: 30000, profit: 4100 },
];

const weeklyRevenueData = [
  { week: 'Week 1', revenue: 500, consultations: 15 },
  { week: 'Week 2', revenue: 800, consultations: 24 },
  { week: 'Week 3', revenue: 600, consultations: 18 },
  { week: 'Week 4', revenue: 900, consultations: 27 },
];

const dailyRevenueData = [
  { day: 'Mon', revenue: 120, patients: 8 },
  { day: 'Tue', revenue: 150, patients: 10 },
  { day: 'Wed', revenue: 100, patients: 7 },
  { day: 'Thu', revenue: 200, patients: 12 },
  { day: 'Fri', revenue: 180, patients: 11 },
  { day: 'Sat', revenue: 90, patients: 6 },
  { day: 'Sun', revenue: 50, patients: 3 },
];

const appointmentData = [
  {
    patientId: 'PAT001',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    age: 34,
    gender: 'Male',
    type: 'Physical',
    date: '01-08-2025',
    status: 'Scheduled',
  },
  {
    patientId: 'PAT002',
    name: 'Priya Patel',
    phone: '+91 91234 56789',
    age: 28,
    gender: 'Female',
    type: 'Virtual',
    date: '02-08-2025',
    status: 'Completed',
  },
  {
    patientId: 'PAT003',
    name: 'Vikram Singh',
    phone: '+91 99887 65432',
    age: 45,
    gender: 'Male',
    type: 'Emergency',
    date: '03-08-2025',
    status: 'Scheduled',
  },
  {
    patientId: 'PAT004',
    name: 'Ananya Gupta',
    phone: '+91 97654 32109',
    age: 19,
    gender: 'Female',
    type: 'Virtual',
    date: '04-08-2025',
    status: 'Cancelled',
  },
  {
    patientId: 'PAT005',
    name: 'Rohan Desai',
    phone: '+91 96543 21098',
    age: 60,
    gender: 'Male',
    type: 'Physical',
    date: '05-08-2025',
    status: 'Scheduled',
  },
  {
    patientId: 'PAT006',
    name: 'Meera Iyer',
    phone: '+91 95432 10987',
    age: 52,
    gender: 'Female',
    type: 'Emergency',
    date: '06-08-2025',
    status: 'Completed',
  },
  {
    patientId: 'PAT007',
    name: 'Aditya Rao',
    phone: '+91 94321 09876',
    age: 27,
    gender: 'Male',
    type: 'Virtual',
    date: '07-08-2025',
    status: 'Scheduled',
  },
];

const demographicsData = [
  { name: 'Under 20', value: 10 },
  { name: '20-40', value: 35 },
  { name: '41-60', value: 40 },
  { name: 'Over 60', value: 15 },
];

const serviceDistributionData = [
  { subject: 'Consultation', A: 120, fullMark: 150 },
  { subject: 'Diagnostics', A: 80, fullMark: 150 },
  { subject: 'Therapy', A: 60, fullMark: 150 },
  { subject: 'Surgery', A: 40, fullMark: 150 },
  { subject: 'Follow-up', A: 90, fullMark: 150 },
];

const activityLog = [
  { id: 'ACT001', action: 'Updated prescription for Aarav Sharma', timestamp: '07-08-2025 10:30 AM' },
  { id: 'ACT002', action: 'Added notes for Priya Patel', timestamp: '06-08-2025 03:15 PM' },
  { id: 'ACT003', action: 'Scheduled emergency for Vikram Singh', timestamp: '05-08-2025 09:00 AM' },
  { id: 'ACT004', action: 'Cancelled appointment for Ananya Gupta', timestamp: '04-08-2025 11:45 AM' },
];

const patientFeedback = [
  { id: 'FB001', patient: 'Aarav Sharma', rating: 5, comment: 'Excellent service and care', date: '05-08-2025' },
  { id: 'FB002', patient: 'Priya Patel', rating: 4, comment: 'Very professional staff', date: '04-08-2025' },
  { id: 'FB003', patient: 'Vikram Singh', rating: 5, comment: 'Emergency care was prompt and effective', date: '03-08-2025' },
  { id: 'FB004', patient: 'Ananya Gupta', rating: 3, comment: 'Good but waiting time was long', date: '02-08-2025' },
];

const COLORS = ['#1e90ff', '#28a745', '#ffbb28', '#ff4444', '#9c27b0', '#00bcd4'];

const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
    >
      {children}
    </motion.div>
  );
};

export const DoctorsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'lead' | 'revenue' | 'appointments' | 'analytics'>('lead');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeRevenueView, setActiveRevenueView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' },
  };

  const sortedAppointments = [...appointmentData].sort((a, b) => {
    const dateA = new Date(a.date.split('-').reverse().join('-'));
    const dateB = new Date(b.date.split('-').reverse().join('-'));
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleSortDate = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getRevenueData = () => {
    switch (activeRevenueView) {
      case 'monthly': return monthlyRevenueData;
      case 'weekly': return weeklyRevenueData;
      case 'daily': return dailyRevenueData;
      default: return monthlyRevenueData;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-white">
      {/* Banner Section */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-4 animate-pulse h-24"></div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <AnimatedCard delay={0.1}>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Patients</h3>
                <p className="text-lg font-bold text-blue-800">
                  <AnimatedCounter value={1234} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="p-3 bg-green-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Appointments</h3>
                <p className="text-lg font-bold text-green-800">
                  <AnimatedCounter value={87} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">+5 today</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
                <p className="text-lg font-bold text-purple-800">
                  ₹<AnimatedCounter value={71000} />
                </p>
                <p className="text-xs text-gray-500 mt-1">+22% from last month</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Avg. Wait Time</h3>
                <p className="text-lg font-bold text-yellow-800">
                  <AnimatedCounter value={15} duration={1.5} /> min
                </p>
                <p className="text-xs text-gray-500 mt-1">-3 min from last month</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.5}>
              <div className="p-3 bg-red-100 rounded-full">
                <HeartPulse className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Emergency Cases</h3>
                <p className="text-lg font-bold text-red-800">
                  <AnimatedCounter value={9} duration={1.5} />
                </p>
                <p className="text-xs text-gray-500 mt-1">+2 this week</p>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['lead', 'revenue', 'appointments', 'analytics'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-t font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab === 'lead' && 'Lead Analytics'}
            {tab === 'revenue' && 'Revenue Insights'}
            {tab === 'appointments' && 'Appointments'}
            {tab === 'analytics' && 'Advanced Analytics'}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'lead' && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600 bg-gradient-to-r from-blue-100 to-white p-2 rounded">📈 Lead Generation Trends</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Monthly</button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Quarterly</button>
                </div>
              </div>
              <p className="text-gray-500 mb-4">Monthly lead acquisition, conversion, and dropout rates</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="leads" 
                      fill="#1e90ff" 
                      name="Leads"
                      onMouseEnter={() => setHoveredBar('leads')}
                      onMouseLeave={() => setHoveredBar(null)}
                      opacity={hoveredBar === null || hoveredBar === 'leads' ? 1 : 0.5}
                    />
                    <Bar 
                      dataKey="conversions" 
                      fill="#28a745" 
                      name="Conversions"
                      onMouseEnter={() => setHoveredBar('conversions')}
                      onMouseLeave={() => setHoveredBar(null)}
                      opacity={hoveredBar === null || hoveredBar === 'conversions' ? 1 : 0.5}
                    />
                    <Bar 
                      dataKey="dropouts" 
                      fill="#ff4444" 
                      name="Dropouts"
                      onMouseEnter={() => setHoveredBar('dropouts')}
                      onMouseLeave={() => setHoveredBar(null)}
                      opacity={hoveredBar === null || hoveredBar === 'dropouts' ? 1 : 0.5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-600 bg-gradient-to-r from-green-100 to-white p-2 rounded">📊 Conversion Funnel</h2>
              <p className="text-gray-500 mb-4">Patient acquisition journey overview</p>
              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-500">Leads</div>
                  <div className="mt-2 h-2 bg-blue-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">42%</div>
                  <div className="text-sm text-gray-500">Engaged</div>
                  <div className="mt-2 h-2 bg-green-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-gray-500">Consulted</div>
                  <div className="mt-2 h-2 bg-purple-100 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">18%</div>
                  <div className="text-sm text-gray-500">Converted</div>
                  <div className="mt-2 h-2 bg-yellow-100 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Top Lead Sources</h3>
              <div className="space-y-3">
                {[
                  { source: 'Website', percentage: 45, color: 'bg-blue-500' },
                  { source: 'Referrals', percentage: 30, color: 'bg-green-500' },
                  { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
                  { source: 'Other', percentage: 10, color: 'bg-gray-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">{item.source}</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                    <div className="w-10 text-right text-sm font-medium">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-600 bg-gradient-to-r from-green-100 to-white p-2 rounded">💰 Revenue Overview</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveRevenueView('monthly')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      activeRevenueView === 'monthly' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setActiveRevenueView('weekly')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      activeRevenueView === 'weekly' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setActiveRevenueView('daily')}
                    className={`px-3 py-1 rounded-full text-xs ${
                      activeRevenueView === 'daily' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Daily
                  </button>
                </div>
              </div>
              
              <p className="text-gray-500 mb-4">
                {activeRevenueView === 'monthly' ? 'Monthly revenue, expenses, and profit' : 
                 activeRevenueView === 'weekly' ? 'Weekly revenue and consultations' : 
                 'Daily revenue and patient visits'}
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getRevenueData()}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#28a745" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#28a745" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey={activeRevenueView === 'monthly' ? 'month' : activeRevenueView === 'weekly' ? 'week' : 'day'} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#28a745"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      activeDot={{ r: 6 }}
                    />
                    {activeRevenueView === 'monthly' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stroke="#ff4444"
                          fillOpacity={1}
                          fill="url(#colorExpenses)"
                          activeDot={{ r: 6 }}
                        >
                          <defs>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ff4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </Area>
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stroke="#1e90ff"
                          fillOpacity={1}
                          fill="url(#colorProfit)"
                          activeDot={{ r: 6 }}
                        >
                          <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </Area>
                      </>
                    )}
                    {(activeRevenueView === 'weekly' || activeRevenueView === 'daily') && (
                      <Area
                        type="monotone"
                        dataKey={activeRevenueView === 'weekly' ? 'consultations' : 'patients'}
                        stroke="#1e90ff"
                        fillOpacity={1}
                        fill="url(#colorSecondary)"
                        activeDot={{ r: 6 }}
                      >
                        <defs>
                          <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </Area>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-xl font-bold text-blue-600">₹24,500</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <span>↑ 12% from last month</span>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Revenue/Patient</p>
                      <p className="text-xl font-bold text-purple-600">₹1,200</p>
                    </div>
                    <FileText className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <span>↑ 8% from last month</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue Target</p>
                      <p className="text-xl font-bold text-yellow-600">85% Achieved</p>
                    </div>
                    <AlertCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <span>On track for monthly goal</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 bg-gradient-to-r from-blue-100 to-white p-2 rounded">📊 Revenue Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">By Service Type</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Consultation', value: 45 },
                            { name: 'Diagnostics', value: 25 },
                            { name: 'Therapy', value: 20 },
                            { name: 'Other', value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {COLORS.slice(0, 4).map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Service Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={serviceDistributionData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar
                          name="Services"
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow p-6 border lg:col-span-2"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                  <Calendar className="h-6 w-6 mr-2" /> Appointment Preview
                </h2>
                <button 
                  onClick={handleSortDate}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center"
                >
                  {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                </button>
              </div>
              
              <p className="text-gray-500 mb-4">Recent appointments (Virtual, Physical, Emergency)</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAppointments.map((appointment, index) => (
                      <motion.tr
                        key={appointment.patientId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                              <div className="text-sm text-gray-500">{appointment.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.age} yrs, {appointment.gender}</div>
                          <div className="text-sm text-gray-500">{appointment.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                appointment.type === 'Physical'
                                  ? 'bg-blue-100 text-blue-800'
                                  : appointment.type === 'Virtual'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appointment.type}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">{appointment.date}</span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === 'Scheduled'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : appointment.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-800">Message</button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                <Stethoscope className="h-6 w-6 mr-2" /> Today's Schedule
              </h2>
              
              <p className="text-gray-500 mb-4">Upcoming appointments for today</p>
              <div className="space-y-4">
                {sortedAppointments
                  .filter((app) => app.date === '07-08-2025') // Filter for today's date (assuming 07-08-2025)
                  .slice(0, 3)
                  .map((appointment, index) => (
                    <motion.div
                      key={appointment.patientId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.name}</h3>
                          <p className="text-sm text-gray-500">{appointment.type} Appointment</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {appointment.date}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>10:00 AM - 10:30 AM</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                          Start
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          Reschedule
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-green-100 text-green-600 rounded-lg flex flex-col items-center justify-center hover:bg-green-200 transition-colors">
                    <ClipboardList className="h-6 w-6 mb-1" />
                    <span className="text-sm">New Appointment</span>
                  </button>
                  <button className="p-3 bg-blue-100 text-blue-600 rounded-lg flex flex-col items-center justify-center hover:bg-blue-200 transition-colors">
                    <FileText className="h-6 w-6 mb-1" />
                    <span className="text-sm">Add Prescription</span>
                  </button>
                  <button className="p-3 bg-purple-100 text-purple-600 rounded-lg flex flex-col items-center justify-center hover:bg-purple-200 transition-colors">
                    <Users className="h-6 w-6 mb-1" />
                    <span className="text-sm">New Patient</span>
                  </button>
                  <button className="p-3 bg-yellow-100 text-yellow-600 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-200 transition-colors">
                    <DollarSign className="h-6 w-6 mb-1" />
                    <span className="text-sm">Create Invoice</span>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow p-6 border lg:col-span-3"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                <Activity className="h-6 w-6 mr-2" /> Recent Activity
              </h2>
              <p className="text-gray-500 mb-4">Recent doctor actions and updates</p>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow p-6 border lg:col-span-2"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                <Users className="h-6 w-6 mr-2" /> Patient Demographics
              </h2>
              <p className="text-gray-500 mb-4">Age distribution of patients</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6 border"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                <HeartPulse className="h-6 w-6 mr-2" /> Patient Feedback
              </h2>
              <p className="text-gray-500 mb-4">Recent patient feedback and ratings</p>
              <div className="space-y-4">
                {patientFeedback.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{feedback.patient}</h3>
                        <p className="text-xs text-gray-500">{feedback.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.375 2.45a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.375-2.45a1 1 0 00-1.175 0l-3.375 2.45c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.683 9.397c-.784-.57-.382-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{feedback.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow p-6 border lg:col-span-3"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center bg-gradient-to-r from-blue-100 to-white p-2 rounded">
                <Stethoscope className="h-6 w-6 mr-2" /> Service Distribution
              </h2>
              <p className="text-gray-500 mb-4">Performance of medical services</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={serviceDistributionData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Radar
                      name="Services"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
    </div>
  );
};