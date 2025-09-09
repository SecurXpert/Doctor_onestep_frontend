import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { 
  Calendar, 
  TrendingUp, 
  Bell, 
  ChevronLeft,
  Stethoscope,
  Settings,

  User,
  ChevronDown,

} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarItems = [
    {
    title: 'DoctorsDashboard',
    href: '/doctorsdashboard',
    icon: User,
  },
  {
    title: 'Appointments',
    href: '/appointments',
    icon: Calendar,
  },
  {
    title: 'Digital Marketing',
    href: '/digital-marketing',
    icon: TrendingUp,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {

    title: 'Settings',
    icon: Settings,
    subItems: [
      { title: 'Change Password', href: 'change-password' },
      { title: 'My Subscriptions', href: 'subscriptions' },
      { title: 'Availability', href: 'availability' },
      { title: 'Terms and Conditions', href: 'terms' },
      { title: 'Privacy Policy', href: 'privacy' },
    ],
  },
  {
    title: 'Portfolio',
    icon: Stethoscope,
    subItems: [
      { title: 'View', href: '/doctorportfolio' },
      { title: 'Edit', href: '/doctorportfolio/edit' },
    ],

  },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setOpenSubMenu(null); // Close any open submenus when collapsing
    }
  };

  const toggleSubMenu = (title: string) => {
    if (collapsed) return; // Prevent submenu toggling when collapsed
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r transition-all duration-300 md:sticky md:top-16",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">Menu</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="hidden md:flex"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isSubMenuOpen = openSubMenu === item.title;

                return (
                  <li key={item.href || item.title}>
                    {item.href ? (
                      <NavLink
                        to={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-medical"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            collapsed && "justify-center px-2"
                          )
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    ) : (
                      <div
                        onClick={() => toggleSubMenu(item.title)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                          isSubMenuOpen
                            ? "bg-primary text-primary-foreground shadow-medical"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                        {!collapsed && item.subItems && (
                          <ChevronDown className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            isSubMenuOpen && "rotate-180"
                          )} />
                        )}
                      </div>
                    )}
                    {!collapsed && isSubMenuOpen && item.subItems && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.href}>
                            <NavLink
                              to={subItem.href}
                              onClick={() => {
                                if (window.innerWidth < 768) {
                                  onClose();
                                }
                              }}
                              className={({ isActive }) =>
                                cn(
                                  "flex items-center gap-3 px-3 py-1 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                                  isActive && "bg-accent text-accent-foreground"
                                )
                              }
                            >
                              <span>{subItem.title}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};