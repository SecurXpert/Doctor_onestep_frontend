import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  // If user is logged in, redirect to appointments
  if (user) {
    return <Navigate to="/appointments" replace />;
  }
  
  // If not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
