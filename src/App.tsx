import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Appointments } from "./pages/Appointments";
import { DigitalMarketing } from "./pages/DigitalMarketing";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Settings } from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import Doctorsdata from "./pages/Doctorsdata";
import  Leads  from "./pages/Leads";
import { DoctorsDashboard } from "./pages/DoctorsDashboard";
import { GetData } from './pages/GetData';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/appointments" replace />;
};

const SessionInitializer = () => {
  const { setUser, setIsLoading } = useAuth();

  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          setIsLoading(true);
          // Decode the token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            email: 'unknown', // You might want to store email in token or fetch it
            role: payload.role,
            token: token
          });
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    restoreSession();
  }, [setUser, setIsLoading]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <SessionInitializer />
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/doctorsdashboard" replace />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="digital-marketing" element={<DigitalMarketing />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="doctorsdata" element={<Doctorsdata />} />
                <Route path="leads" element={<Leads />} />
                <Route path="doctorsdashboard" element={<DoctorsDashboard />} />
                 <Route path="/getdata" element={<GetData />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

