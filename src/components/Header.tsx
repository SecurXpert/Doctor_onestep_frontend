// import { useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Button } from './ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from './ui/dropdown-menu';
// import { User, LogOut, Menu, Bell } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface HeaderProps {
//   onMenuClick: () => void;
// }

// interface Notification {
//   id: number;
//   message: string;
//   timestamp: string;
// }

// export const Header = ({ onMenuClick }: HeaderProps) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [notificationCount, setNotificationCount] = useState(0);

//   useEffect(() => {
//     const socket = new WebSocket("ws://api.onestepmedi.com:8000/Notifications/ws/doctor/DR201");

//     socket.onopen = () => {
//       console.log("Connected to WebSocket");
//     };

//     socket.onmessage = (event) => {
//       const newNotification = {
//         id: Date.now(),
//         message: event.data,
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Keep latest 10 notifications
//       setNotificationCount((prev) => prev + 1);

//       // Play notification sound
//       const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
//       audio.play().catch((err) => console.log("Audio playback failed:", err));
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleProfile = () => {
//     navigate('/profile');
//   };

//   const handleClearNotifications = () => {
//     setNotifications([]);
//     setNotificationCount(0);
//   };

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
//       <div className="container flex h-16 items-center justify-between px-4">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onMenuClick}
//             className="md:hidden"
//           >
//             <Menu className="h-5 w-5" />
//           </Button>
          
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
//               <span className="text-white font-bold text-sm">MD</span>
//             </div>
//             <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
//               Doctor Dashboard
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                 <Bell className="h-5 w-5" />
//                 {notificationCount > 0 && (
//                   <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
//                     {notificationCount}
//                   </span>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-80 bg-card border shadow-medical" align="end">
//               <div className="flex items-center justify-between p-2">
//                 <p className="text-sm font-medium text-foreground">
//                   Notifications ({notificationCount})
//                 </p>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleClearNotifications}
//                   className="text-xs text-destructive"
//                 >
//                   Clear All
//                 </Button>
//               </div>
//               <DropdownMenuSeparator />
//               {notifications.length === 0 ? (
//                 <p className="text-sm text-muted-foreground p-2">No notifications</p>
//               ) : (
//                 notifications.map((notification) => (
//                   <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-2">
//                     <div className="flex items-center gap-2">
//                       <span className="text-blue-500">📨</span>
//                       <span className="text-sm">{notification.message}</span>
//                     </div>
//                     <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
//                   </DropdownMenuItem>
//                 ))
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                 <Avatar className="h-10 w-10 border-2 border-primary/20">
//                   <AvatarFallback className="bg-gradient-primary text-white font-semibold">
//                     {user?.avatar || user?.name?.charAt(0) || 'D'}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56 bg-card border shadow-medical" align="end">
//               <div className="flex items-center justify-start gap-2 p-2">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium text-foreground">
//                     {user?.name || 'Doctor'}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {user?.email || 'doctor@hospital.com'}
//                   </p>
//                 </div>
//               </div>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onClick={handleProfile}
//               >
//                 <User className="mr-2 h-4 w-4" />
//                 Profile
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer text-destructive"
//                 onClick={handleLogout}
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// };

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://api.onestepmedi.com:8000/Notifications/ws/doctor/DR201");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const newNotification = {
        id: Date.now(),
        message: event.data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Keep latest 10 notifications
      setNotificationCount((prev) => prev + 1);

      // Play notification sound
      const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
      audio.play().catch((err) => console.log("Audio playback failed:", err));
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Modified logo for navigation */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">MD</span>
            </div>
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Doctor Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-card border shadow-medical" align="end">
              <div className="flex items-center justify-between p-2">
                <p className="text-sm font-medium text-foreground">
                  Notifications ({notificationCount})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearNotifications}
                  className="text-xs text-destructive"
                >
                  Clear All
                </Button>
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">📨</span>
                      <span className="text-sm">{notification.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {user?.avatar || user?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card border shadow-medical" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || 'Doctor'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'doctor@hospital.com'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleProfile}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
};