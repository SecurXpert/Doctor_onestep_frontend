import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Calendar, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../hooks/use-toast';

// Utility to decode JWT token
const decodeToken = (token) => {
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

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appointment': return 'text-primary';
      case 'emergency': return 'text-destructive';
      case 'reminder': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const IconComponent = notification.icon;

  return (
    <Card className={`mb-4 shadow-card-medical hover:shadow-medical transition-all duration-300 ${notification.unread ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <IconComponent className={`h-5 w-5 ${getTypeColor(notification.type)}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title}
                </h3>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
                <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                  {notification.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {notification.time}
              </p>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            {notification.unread && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkRead(notification.id)}
                className="h-8 w-8 p-0"
              >
                {/* <CheckCircle className="h-4 w-4 text-success" /> */}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(notification.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Notifications = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fetch regular appointments
  const fetchRegularAppointments = async (doctorId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found. Please log in.",
        variant: "destructive",
      });
      logout();
      return [];
    }
    try {
      const response = await fetch(`https://api.onestepmedi.com:8000/appointments/doctor-appointments/?doctor_id=${doctorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch appointments: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      return data.map(apt => ({
        appointment_id: apt.appointment_id,
        doctor_unique_id: apt.doctor_unique_id,
        doctor_name: apt.doctor_name || 'Unknown Doctor',
        name: apt.name,
        patient_id: apt.patient_id || '',
        phone_number: apt.phone_number,
        specialization: apt.specialization,
        preferred_date: apt.preferred_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        time_slot: apt.time_slot || new Date(apt.created_at).toTimeString().split(' ')[0],
        appointment_type: apt.appointment_type,
        created_at: apt.created_at,
        expires_at: apt.expires_at || new Date(new Date(apt.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: apt.status,
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to fetch regular appointments: ${err.message}`,
        variant: "destructive",
      });
      if (err.message === 'Session expired') logout();
      return [];
    }
  };

  // Fetch emergency appointments
  const fetchEmergencyAppointments = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found. Please log in.",
        variant: "destructive",
      });
      logout();
      return [];
    }
    try {
      const response = await fetch('https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch emergency appointments: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      return data.map(apt => ({
        appointment_id: apt.appointment_id,
        doctor_unique_id: apt.forward_to,
        doctor_name: apt.doctor_name || 'Unknown Doctor',
        name: apt.name,
        patient_id: apt.patient_id || '',
        phone_number: apt.phone_number,
        specialization: apt.specialization,
        preferred_date: apt.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        time_slot: apt.time_slot || new Date(apt.created_at).toTimeString().split(' ')[0],
        appointment_type: apt.appointment_type,
        created_at: apt.created_at,
        expires_at: apt.expires_at || new Date(new Date(apt.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        status: apt.status,
      }));
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to fetch emergency appointments: ${err.message}`,
        variant: "destructive",
      });
      if (err.message === 'Session expired') logout();
      return [];
    }
  };

  // Generate appointment reminder notifications
  const generateReminderNotifications = (appointments) => {
    const now = new Date();
    return appointments.flatMap(apt => {
      const aptDateTime = new Date(`${apt.preferred_date}T${apt.time_slot}`);
      const timeDiff = (aptDateTime - now) / (1000 * 60); // Difference in minutes
      const reminders = [];

      // Only generate reminders for confirmed or available appointments
      if (apt.status === 'confirmed' || apt.status === 'available') {
        // 30-minute reminder
        if (timeDiff > 29 && timeDiff <= 30) {
          reminders.push({
            id: `${apt.appointment_id}-30min`,
            type: apt.appointment_type === 'emergency' ? 'emergency' : 'reminder',
            title: `${apt.appointment_type === 'emergency' ? 'Emergency' : 'Appointment'} Reminder (30 min)`,
            message: `${apt.name}'s ${apt.appointment_type.toLowerCase()} appointment is in 30 minutes on ${apt.preferred_date} at ${new Date(`2000-01-01T${apt.time_slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            time: 'Now',
            unread: true,
            priority: apt.appointment_type === 'emergency' ? 'high' : 'medium',
            icon: Clock,
          });
        }

        // 5-minute reminder
        if (timeDiff > 4 && timeDiff <= 5) {
          reminders.push({
            id: `${apt.appointment_id}-5min`,
            type: apt.appointment_type === 'emergency' ? 'emergency' : 'reminder',
            title: `${apt.appointment_type === 'emergency' ? 'Emergency' : 'Appointment'} Reminder (5 min)`,
            message: `${apt.name}'s ${apt.appointment_type.toLowerCase()} appointment is in 5 minutes on ${apt.preferred_date} at ${new Date(`2000-01-01T${apt.time_slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            time: 'Now',
            unread: true,
            priority: apt.appointment_type === 'emergency' ? 'high' : 'medium',
            icon: Clock,
          });
        }
      }

      return reminders;
    });
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found. Please log in.",
        variant: "destructive",
      });
      logout();
      return;
    }

    const decodedToken = decodeToken(token);
    const doctorId = decodedToken?.id;

    if (!doctorId) {
      toast({
        title: "Error",
        description: "Invalid token. Please log in again.",
        variant: "destructive",
      });
      logout();
      return;
    }

    try {
      const [regularAppointments, emergencyAppointments] = await Promise.all([
        fetchRegularAppointments(doctorId),
        fetchEmergencyAppointments(),
      ]);

      const allAppointments = [...regularAppointments, ...emergencyAppointments];
      const reminderNotifications = generateReminderNotifications(allAppointments);

      // Generate notifications only from appointments
      const updatedNotifications = [
        ...allAppointments.map(apt => ({
          id: apt.appointment_id,
          type: apt.appointment_type === 'emergency' ? 'emergency' : 'appointment',
          title: `${apt.appointment_type === 'emergency' ? 'Emergency' : 'New'} Appointment Request`,
          message: `${apt.name} has requested an appointment for ${apt.preferred_date} at ${new Date(`2000-01-01T${apt.time_slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          time: new Date(apt.created_at).toLocaleString(),
          unread: apt.status === 'confirmed' || apt.status === 'available',
          priority: apt.appointment_type === 'emergency' ? 'high' : 'medium',
          icon: Calendar,
        })),
        ...reminderNotifications,
      ];

      setNotifications(updatedNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new appointments every minute
    const interval = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with your practice activities</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'appointment' ? 'default' : 'outline'}
          onClick={() => setFilter('appointment')}
          size="sm"
        >
          Appointments
        </Button>
        <Button
          variant={filter === 'emergency' ? 'default' : 'outline'}
          onClick={() => setFilter('emergency')}
          size="sm"
        >
          Emergency
        </Button>
      </div>

      {/* Notifications List */}
      <Card className="shadow-card-medical">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {filteredNotifications.length === 0 ? 'No notifications found' : `${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications to display</p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};