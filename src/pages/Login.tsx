// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/components/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Stethoscope, Mail, Lock } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login, isLoading, setIsLoading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await fetch('https://api.onestepmedi.com:8000/doctors/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.status === 200) {
//         const data = await response.json();
//         const token = data.access_token;

//         if (token) {
//           // Store token in localStorage
//           localStorage.setItem('authToken', token);
          
//           // Update auth context
//           await login(email, password);
          
//           // Navigate on 200 status
//           toast({
//             title: "Login Successful",
//             description: "Welcome back to your dashboard!",
//           });
//           navigate('/appointments');
//         } else {
//           throw new Error('No token received');
//         }
//       } else {
//         throw new Error('Login failed');
//       }
//     } catch (err) {
//       setError('Invalid email or password');
//       toast({
//         title: "Login Failed",
//         description: "Please check your credentials and try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-medical">
//               <Stethoscope className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//             Doctor Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Access your medical practice management system
//           </p>
//         </div>

//         <Card className="shadow-card-medical border-0">
//           <CardHeader className="text-center">
//             <CardTitle>Sign In</CardTitle>
//             <CardDescription>
//               Enter your credentials to access your dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
              
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="doctor@hospital.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>
              
//               <Button 
//                 type="submit" 
//                 className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medical"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing In...
//                   </>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>
//             </form>
            
//             <div className="mt-6 text-center">
//               <p className="text-sm text-muted-foreground">
//                 Demo credentials: doctor@hospital.com / password123
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Stethoscope, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to your dashboard!',
      });
      navigate('/doctorsdashboard');
    } else {
      setError('Invalid email or password');
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-medical">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Access your medical practice management system
          </p>
        </div>

        <Card className="shadow-card-medical border-0">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medical"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};