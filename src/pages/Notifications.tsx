import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, User, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';

// Mock notification data
const notificationsData = [
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment Request',
    message: 'John Smith has requested an appointment for tomorrow at 2:00 PM',
    time: '5 minutes ago',
    unread: true,
    priority: 'high',
    icon: Calendar,
  },
  {
    id: 2,
    type: 'patient',
    title: 'Patient Update',
    message: 'Emily Johnson has updated her medical history',
    time: '1 hour ago',
    unread: true,
    priority: 'medium',
    icon: User,
  },
  {
    id: 3,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM',
    time: '2 hours ago',
    unread: false,
    priority: 'low',
    icon: AlertCircle,
  },
  {
    id: 4,
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: 'Sarah Wilson has confirmed her appointment for Friday',
    time: '3 hours ago',
    unread: false,
    priority: 'medium',
    icon: CheckCircle,
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Appointment Reminder',
    message: 'You have 3 appointments scheduled for tomorrow',
    time: '1 day ago',
    unread: false,
    priority: 'medium',
    icon: Clock,
  },
];

const NotificationCard = ({ notification, onMarkRead, onDelete }: any) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'text-primary';
      case 'patient': return 'text-success';
      case 'system': return 'text-warning';
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
                <CheckCircle className="h-4 w-4 text-success" />
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
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const handleDelete = (id: number) => {
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
          variant={filter === 'patient' ? 'default' : 'outline'}
          onClick={() => setFilter('patient')}
          size="sm"
        >
          Patients
        </Button>
        <Button
          variant={filter === 'system' ? 'default' : 'outline'}
          onClick={() => setFilter('system')}
          size="sm"
        >
          System
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
          {filteredNotifications.length === 0 ? (
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