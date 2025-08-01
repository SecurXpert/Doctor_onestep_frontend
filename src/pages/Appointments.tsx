import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Clock, User, Phone, MapPin } from 'lucide-react';

// Mock data for appointments
const appointmentsData = {
  new: [
    { id: 1, patient: 'John Smith', time: '09:00 AM', date: '2024-01-15', phone: '+1 234 567 8900', condition: 'General Checkup' },
    { id: 2, patient: 'Emily Johnson', time: '10:30 AM', date: '2024-01-15', phone: '+1 234 567 8901', condition: 'Follow-up' },
    { id: 3, patient: 'Michael Brown', time: '02:00 PM', date: '2024-01-15', phone: '+1 234 567 8902', condition: 'Consultation' },
  ],
  approved: [
    { id: 4, patient: 'Sarah Wilson', time: '11:00 AM', date: '2024-01-16', phone: '+1 234 567 8903', condition: 'Routine Examination' },
    { id: 5, patient: 'David Lee', time: '03:30 PM', date: '2024-01-16', phone: '+1 234 567 8904', condition: 'Treatment Review' },
  ],
  rejected: [
    { id: 6, patient: 'Lisa Garcia', time: '01:00 PM', date: '2024-01-14', phone: '+1 234 567 8905', condition: 'Emergency', reason: 'Time slot unavailable' },
  ],
  rescheduled: [
    { id: 7, patient: 'Robert Martinez', time: '04:00 PM', date: '2024-01-17', phone: '+1 234 567 8906', condition: 'Surgery Follow-up', originalDate: '2024-01-15' },
  ],
};

const AppointmentCard = ({ appointment, type }: { appointment: any; type: string }) => {
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'rescheduled': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="mb-4 shadow-card-medical hover:shadow-medical transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
              {appointment.patient.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{appointment.patient}</h3>
              <p className="text-sm text-muted-foreground">{appointment.condition}</p>
            </div>
          </div>
          <Badge className={getStatusColor(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{appointment.phone}</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="mt-3 p-2 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">Reason: {appointment.reason}</p>
          </div>
        )}

        {appointment.originalDate && (
          <div className="mt-3 p-2 bg-primary/10 rounded-md">
            <p className="text-sm text-primary">Rescheduled from: {appointment.originalDate}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {type === 'new' && (
            <>
              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">Approve</Button>
              <Button size="sm" variant="outline">Reschedule</Button>
              <Button size="sm" variant="destructive">Reject</Button>
            </>
          )}
          {type === 'approved' && (
            <>
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm" variant="outline">Reschedule</Button>
            </>
          )}
          {type === 'rejected' && (
            <Button size="sm" variant="outline">Review</Button>
          )}
          {type === 'rescheduled' && (
            <>
              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">Confirm</Button>
              <Button size="sm" variant="outline">Reschedule Again</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  const filterAppointments = (appointments: any[]) => {
    if (!searchTerm) return appointments;
    return appointments.filter(apt => 
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">Manage your patient appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card shadow-card-medical">
          <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            New ({appointmentsData.new.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Approved ({appointmentsData.approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Rejected ({appointmentsData.rejected.length})
          </TabsTrigger>
          <TabsTrigger value="rescheduled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Rescheduled ({appointmentsData.rescheduled.length})
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="new" className="space-y-4">
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle className="text-warning">New Appointments</CardTitle>
              <CardDescription>Review and manage new appointment requests</CardDescription>
            </CardHeader>
            <CardContent>
              {filterAppointments(appointmentsData.new).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} type="new" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle className="text-success">Approved Appointments</CardTitle>
              <CardDescription>Confirmed appointments scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {filterAppointments(appointmentsData.approved).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} type="approved" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle className="text-destructive">Rejected Appointments</CardTitle>
              <CardDescription>Appointments that were declined</CardDescription>
            </CardHeader>
            <CardContent>
              {filterAppointments(appointmentsData.rejected).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} type="rejected" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rescheduled" className="space-y-4">
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle className="text-primary">Rescheduled Appointments</CardTitle>
              <CardDescription>Appointments that have been rescheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {filterAppointments(appointmentsData.rescheduled).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} type="rescheduled" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};