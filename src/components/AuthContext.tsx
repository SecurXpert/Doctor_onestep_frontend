// import { createContext, useContext, useState, ReactNode } from 'react';

// interface User {
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   setIsLoading: (loading: boolean) => void;
//   setUser: (user: User | null) => void;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (email: string, password: string) => {
//     try {
//       setUser({ email });
//       return true;
//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('authToken');
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, setIsLoading, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
// AuthContext.tsx
// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://192.168.0.111:10000/doctors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        throw new Error('No token received');
      }

      // Decode the token to get user info (id and role)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        id: payload.id,
        email: email,
        role: payload.role,
        token: token
      };

      localStorage.setItem('authToken', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setIsLoading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};