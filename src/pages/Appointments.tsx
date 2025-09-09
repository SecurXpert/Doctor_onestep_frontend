import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Calendar, Clock, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../hooks/use-toast';

// Utility to decode JWT token
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

interface Appointment {
  appointment_id: string;
  doctor_unique_id: string;
  doctor_name: string;
  name: string;
  patient_id: string;
  phone_number: string;
  specialization: string;
  preferred_date: string;
  time_slot: string;
  appointment_type: string;
  created_at: string;
  expires_at: string;
  status: string;
  rejected_reason?: string;
}

interface PrescriptionItem {
  medicine_name: string;
  dosage_time: string;
  duration_days: number;
  quantity: number;
  cost_per_unit: number;
}

interface Test {
  test_name: string;
  test_description?: string;
}

interface Prescription {
  appointment_id: string;
  patient_id: string;
  items: PrescriptionItem[];
  case_study: {
    symptoms: string;
    diagnosis: string;
    notes: string;
  };
  tests: Test[];
}

const rescheduledAppointments: Appointment[] = [
  {
    appointment_id: "RESCH001",
    doctor_unique_id: "DOC001",
    doctor_name: "Dr. John Smith",
    name: "John Doe",
    patient_id: "PAT001",
    phone_number: "+1234567890",
    specialization: "General Medicine",
    preferred_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time_slot: "10:00:00",
    appointment_type: "Follow-up",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "rescheduled"
  },
  {
    appointment_id: "RESCH002",
    doctor_unique_id: "DOC002",
    doctor_name: "Dr. Jane Wilson",
    name: "Jane Smith",
    patient_id: "PAT002",
    phone_number: "+0987654321",
    specialization: "Cardiology",
    preferred_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time_slot: "11:00:00",
    appointment_type: "Consultation",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "rescheduled"
  }
];

const AppointmentCard = ({
  appointment,
  onReject,
  onViewDetails,
  onAccept,
  showActions = false,
  isAlreadyAccepted = false, // New prop to indicate if already accepted
}: {
  appointment: Appointment;
  onReject?: (id: string) => void;
  onViewDetails?: (appointment: Appointment) => void;
  onAccept?: (appointmentId: string, doctorId: string) => void;
  showActions?: boolean;
  isAlreadyAccepted?: boolean;
}) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Decode token to get doctor_id
  const decodedToken = user?.token ? decodeToken(user.token) : null;
  const doctorId = decodedToken?.id;

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onViewDetails
    if (!doctorId) {
      toast({
        title: "Error",
        description: "Invalid token. Please log in again.",
        variant: "destructive",
      });
      logout();
      return;
    }

    if (onAccept) {
      onAccept(appointment.appointment_id, doctorId);
    }
  };

  return (
    <Card
      className="mb-4 shadow-card-medical cursor-pointer hover:shadow-medical transition-all duration-300"
      onClick={() => onViewDetails?.(appointment)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
              {appointment.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{appointment.name}</h3>
              <p className="text-sm text-muted-foreground">
                {appointment.appointment_type}
              </p>
            </div>
          </div>
          <Badge
            className={
              appointment.status === 'rejected' ? 'bg-destructive' :
              appointment.status === 'rescheduled' ? 'bg-info' :
              appointment.status === 'available' ? 'bg-success' :
              appointment.status === 'confirmed' ? 'bg-success' : 'bg-warning'
            }
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{appointment.preferred_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(`2000-01-01T${appointment.time_slot}`).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{appointment.phone_number}</span>
          </div>
        </div>

        {appointment.rejected_reason && (
          <div className="mt-3 p-2 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">Reason: {appointment.rejected_reason}</p>
          </div>
        )}

        {showActions && appointment.status !== 'rejected' && (
          <div className="mt-4 flex gap-2">
            {!isAlreadyAccepted && (
              <Button
                size="sm"
                className="bg-success text-success-foreground hover:bg-success/90"
                onClick={handleAccept}
              >
                Accept
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(appointment.appointment_id);
              }}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Appointments = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [emergencyAppointments, setEmergencyAppointments] = useState<Appointment[]>([]);
  const [doctorSpecialization, setDoctorSpecialization] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAppointmentId, setRejectAppointmentId] = useState<string | null>(null);
  const [alreadyAcceptedAppointments, setAlreadyAcceptedAppointments] = useState<Set<string>>(new Set()); // Track already accepted appointments
  const [prescription, setPrescription] = useState<Prescription>({
    appointment_id: '',
    patient_id: '',
    items: [{
      medicine_name: '',
      dosage_time: '',
      duration_days: 0,
      quantity: 0,
      cost_per_unit: 0,
    }],
    case_study: {
      symptoms: '',
      diagnosis: '',
      notes: '',
    },
    tests: [],
  });
  const navigate = useNavigate();

  // Fetch doctor's profile to get specialization
  const fetchDoctorProfile = async (doctorId: string) => {
    try {
      const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${doctorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch profile: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Doctor profile:', data);
      return data.specialization_name || null;
    } catch (err: any) {
      setError(`❌ Failed to fetch doctor profile: ${err.message}`);
      if (err.message === 'Session expired') {
        logout();
      }
      return null;
    }
  };

  // Fetch emergency appointments and filter by specialization
  const fetchEmergencyAppointments = async (specialization: string) => {
    try {
      const response = await fetch('https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch emergency appointments: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Emergency appointments:', data);
      const mappedAppointments: Appointment[] = data
        .filter((apt: any) => apt.specialization === specialization)
        .map((apt: any) => ({
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
          rejected_reason: apt.rejected_reason,
        }));
      setEmergencyAppointments(mappedAppointments);
      return mappedAppointments;
    } catch (err: any) {
      setError(`❌ Failed to fetch emergency appointments: ${err.message}`);
      if (err.message === 'Session expired') {
        logout();
      }
      return [];
    }
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    if (!user?.token) {
      toast({
        title: "Error",
        description: "Please log in again",
        variant: "destructive"
      });
      logout();
      return;
    }

    const decodedToken = decodeToken(user.token);
    const doctorId = decodedToken?.id;

    if (!doctorId) {
      toast({
        title: "Error",
        description: "Invalid token. Please log in again.",
        variant: "destructive"
      });
      logout();
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Fetch doctor's specialization from profile
      const specialization = await fetchDoctorProfile(doctorId);
      setDoctorSpecialization(specialization);

      // Fetch regular appointments
      const response = await fetch(`https://api.onestepmedi.com:8000/appointments/doctor-appointments/?doctor_id=${doctorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch appointments: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Regular appointments:', data);

      // Map API response to Appointment interface
      const mappedAppointments: Appointment[] = data.map((apt: any) => ({
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
        rejected_reason: apt.rejected_reason,
      }));

      // Fetch emergency appointments if specialization is available
      let emergencyAppts: Appointment[] = [];
      if (specialization) {
        emergencyAppts = await fetchEmergencyAppointments(specialization);
      }

      // Combine all appointments
      const allAppointments = [...mappedAppointments, ...emergencyAppts, ...rescheduledAppointments];
      console.log('All appointments:', allAppointments);
      setAppointments(allAppointments);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
      if (err.message === 'Session expired') {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch patient profile
  const fetchPatientProfile = async (patientName: string): Promise<string | null> => {
    try {
      const response = await fetch(`https://api.onestepmedi.com:8000/profile/patient?name=${encodeURIComponent(patientName)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to fetch patient profile: ${errorData.message || response.statusText}`
        );
      }
      const data = await response.json();
      console.log('Patient profile:', data);
      return data.patient_id || null;
    } catch (err: any) {
      setError(`Failed to fetch patient profile for ${patientName}: ${err.message}`);
      if (err.message === 'Session expired') {
        logout();
      }
      return null;
    }
  };

  // Handle accept appointment
  const handleAccept = async (appointmentId: string, doctorId: string) => {
    try {
      const response = await fetch('https://api.onestepmedi.com:8000/emergency/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          appointment_id: appointmentId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment accepted successfully",
        });
        fetchAppointments(); // Refresh appointments list
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail === '⛔ Already accepted by another doctor') {
          setAlreadyAcceptedAppointments(prev => new Set(prev).add(appointmentId));
          toast({
            title: "Error",
            description: "This appointment has already been accepted by another doctor.",
            variant: "destructive",
          });
        } else {
          throw new Error(
            response.status === 401 ? 'Session expired' : `Failed to accept appointment: ${errorData.message || errorData.detail || response.statusText}`
          );
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      if (err.message === 'Session expired') {
        logout();
      }
    }
  };

  // Handle reject appointment
  const handleReject = async (appointmentId: string) => {
    setRejectAppointmentId(appointmentId);
    setRejectDialogOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectReason || !rejectAppointmentId) return;

    try {
      const response = await fetch(
        `https://api.onestepmedi.com:8000/appointments/appointments/reject/${rejectAppointmentId}?reason=${encodeURIComponent(rejectReason)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        fetchAppointments();
        setRejectDialogOpen(false);
        setRejectReason('');
        setRejectAppointmentId(null);
        toast({
          title: "Success",
          description: "Appointment rejected successfully",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Rejection failed: ${errorData.message || response.statusText}`
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
      if (err.message === 'Session expired') {
        logout();
      }
    }
  };

  const handleViewDetails = async (appointment: Appointment) => {
    let patientId = appointment.patient_id;
    if (!patientId && appointment.appointment_type !== 'emergency') {
      patientId = await fetchPatientProfile(appointment.name);
      if (!patientId) {
        setError(`Cannot open case study: Patient ID not found for ${appointment.name}`);
        return;
      }
    }

    setSelectedAppointment(appointment);
    setPrescription({
      appointment_id: appointment.appointment_id,
      patient_id: patientId || '',
      items: [{
        medicine_name: '',
        dosage_time: '',
        duration_days: 0,
        quantity: 0,
        cost_per_unit: 0,
      }],
      case_study: {
        symptoms: '',
        diagnosis: '',
        notes: '',
      },
      tests: [],
    });
  };

  const handlePrescriptionSubmit = async () => {
    if (!selectedAppointment) return;

    const payload = {
      appointment_id: prescription.appointment_id,
      patient_id: prescription.patient_id,
      items: prescription.items.map((item) => ({
        medicine_name: item.medicine_name,
        dosage_time: item.dosage_time,
        duration_days: item.duration_days,
        quantity: item.quantity,
        cost_per_unit: item.cost_per_unit,
      })),
      case_study: {
        symptoms: prescription.case_study.symptoms,
        diagnosis: prescription.case_study.diagnosis,
        notes: prescription.case_study.notes,
      },
      tests: prescription.tests
        .filter((test) => test.test_name.trim() !== '')
        .map((test) => ({
          test_name: test.test_name,
          test_description: test.test_description || undefined,
        })),
    };

    if (!payload.patient_id && selectedAppointment.appointment_type !== 'emergency') {
      toast({
        title: "Error",
        description: "Patient ID is missing. Please ensure the patient has a valid profile.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('https://api.onestepmedi.com:8000/prescription/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast({
          title: "Success",
          description: "Prescription created successfully",
        });
        setSelectedAppointment(null);
        fetchAppointments();
        navigate('/prescriptions/new', {
          state: {
            prescription: {
              id: responseData.id || Date.now(),
              appointment_id: payload.appointment_id,
              doctor_id: responseData.doctor_id || 'DOC_UNKNOWN',
              patient_id: payload.patient_id,
              generated_at: responseData.generated_at || new Date().toISOString(),
              file_url: responseData.file_url || '',
              status: responseData.status || 'pending',
              items: payload.items,
              case_study: payload.case_study,
              tests: payload.tests,
            },
          },
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          response.status === 401 ? 'Session expired' : `Failed to create prescription: ${errorData.message || response.statusText}`
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
      if (err.message === 'Session expired') {
        logout();
      }
    }
  };

  const updatePrescriptionItem = (index: number, field: keyof PrescriptionItem, value: string | number) => {
    const newItems = [...prescription.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setPrescription({ ...prescription, items: newItems });
  };

  const addPrescriptionItem = () => {
    setPrescription({
      ...prescription,
      items: [...prescription.items, {
        medicine_name: '',
        dosage_time: '',
        duration_days: 0,
        quantity: 0,
        cost_per_unit: 0,
      }],
    });
  };

  const removePrescriptionItem = (index: number) => {
    setPrescription({
      ...prescription,
      items: prescription.items.filter((_, i) => i !== index),
    });
  };

  const updateTest = (index: number, field: 'test_name' | 'test_description', value: string) => {
    const newTests = [...prescription.tests];
    newTests[index] = { ...newTests[index], [field]: value };
    setPrescription({ ...prescription, tests: newTests });
  };

  const addTest = () => {
    setPrescription({
      ...prescription,
      tests: [...prescription.tests, { test_name: '', test_description: '' }],
    });
  };

  const removeTest = (index: number) => {
    setPrescription({
      ...prescription,
      tests: prescription.tests.filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

  const filteredAppointments = appointments
    .filter((apt) =>
      apt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const categorized = {
    emergency: filteredAppointments.filter(apt => apt.appointment_type === 'emergency'),
    upcoming: filteredAppointments.filter(
      (apt) => {
        const isFuture = new Date(apt.preferred_date) >= today;
        const isNotRejected = apt.status !== 'rejected';
        const isNotRescheduled = apt.status !== 'rescheduled';
        const isNotEmergency = apt.appointment_type !== 'emergency';
        console.log(`Appointment ${apt.appointment_id}: isFuture=${isFuture}, isNotRejected=${isNotRejected}, isNotRescheduled=${isNotRescheduled}, isNotEmergency=${isNotEmergency}`);
        return isFuture && isNotRejected && isNotRescheduled && isNotEmergency;
      }
    ),
    month: filteredAppointments.filter(
      (apt) =>
        new Date(apt.preferred_date).getMonth() === today.getMonth() &&
        new Date(apt.preferred_date).getFullYear() === today.getFullYear() &&
        apt.status !== 'rejected' &&
        apt.status !== 'rescheduled' &&
        apt.appointment_type !== 'emergency'
    ),
    rescheduled: filteredAppointments.filter(
      (apt) => apt.status === 'cancelled_by_hold'
    ),
    rejected: filteredAppointments.filter(
      (apt) => apt.status === 'rejected'
    ),
  };

  console.log('Categorized appointments:', categorized);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">Manage all your appointments</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card shadow-card-medical">
            <TabsTrigger value="emergency" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Emergency Slots ({categorized.emergency.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Upcoming ({categorized.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Appointments ({categorized.month.length})
            </TabsTrigger>
            <TabsTrigger value="rescheduled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Rescheduled ({categorized.rescheduled.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Rejected ({categorized.rejected.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(categorized).map(([key, appts]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <Card className="shadow-card-medical">
                <CardHeader>
                  <CardTitle className={
                    key === 'rejected' ? 'text-destructive' :
                    key === 'emergency' ? 'text-success' :
                    key === 'rescheduled' ? 'text-info' : 'text-warning'
                  }>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Appointments
                  </CardTitle>
                  <CardDescription>Filtered by {key}</CardDescription>
                </CardHeader>
                <CardContent>
                  {appts.length === 0 ? (
                    <p className="text-muted-foreground">No appointments found.</p>
                  ) : (
                    appts.map((appointment) => (
                      <AppointmentCard
                        key={appointment.appointment_id}
                        appointment={appointment}
                        showActions={key === 'upcoming' || key === 'emergency'}
                        onReject={handleReject}
                        onViewDetails={handleViewDetails}
                        onAccept={handleAccept}
                        isAlreadyAccepted={alreadyAcceptedAppointments.has(appointment.appointment_id)} // Pass acceptance status
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Dialog open={selectedAppointment !== null} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Case Study Form</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 p-6">
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Patient Name</Label>
                <Input value={selectedAppointment.name} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</Label>
                <Input value={selectedAppointment.phone_number} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Appointment Date</Label>
                <Input value={selectedAppointment.preferred_date} readOnly />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Time Slot</Label>
                <Input
                  value={new Date(`2000-01-01T${selectedAppointment.time_slot}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Symptoms</Label>
                <Textarea
                  value={prescription.case_study.symptoms}
                  onChange={(e) => setPrescription({
                    ...prescription,
                    case_study: { ...prescription.case_study, symptoms: e.target.value },
                  })}
                  placeholder="Enter symptoms..."
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Diagnosis</Label>
                <Textarea
                  value={prescription.case_study.diagnosis}
                  onChange={(e) => setPrescription({
                    ...prescription,
                    case_study: { ...prescription.case_study, diagnosis: e.target.value },
                  })}
                  placeholder="Enter diagnosis..."
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Notes</Label>
                <Textarea
                  value={prescription.case_study.notes}
                  onChange={(e) => setPrescription({
                    ...prescription,
                    case_study: { ...prescription.case_study, notes: e.target.value },
                  })}
                  placeholder="Enter additional notes..."
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Diagnostic Tests</Label>
                {prescription.tests.map((test, index) => (
                  <div key={index} className="flex items-center mb-3 gap-2">
                    <div className="flex-1">
                      <Label className="block text-sm font-medium text-muted-foreground mb-1">Test Name</Label>
                      <Input
                        value={test.test_name}
                        onChange={(e) => updateTest(index, 'test_name', e.target.value)}
                        placeholder="e.g., Blood Test"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="block text-sm font-medium text-muted-foreground mb-1">Test Description (Optional)</Label>
                      <Input
                        value={test.test_description || ''}
                        onChange={(e) => updateTest(index, 'test_description', e.target.value)}
                        placeholder="e.g., Complete blood count analysis"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => removeTest(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={addTest} className="mt-2">Add Test</Button>
              </div>
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-1">Prescriptions</Label>
                {prescription.items.map((item, index) => (
                  <div key={index} className="border p-4 mb-4 rounded-md relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Medicine Name</Label>
                        <Input
                          value={item.medicine_name}
                          onChange={(e) => updatePrescriptionItem(index, 'medicine_name', e.target.value)}
                          placeholder="Enter medicine name"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Dosage Time</Label>
                        <Input
                          value={item.dosage_time}
                          onChange={(e) => updatePrescriptionItem(index, 'dosage_time', e.target.value)}
                          placeholder="e.g., Morning, Evening"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Duration (Days)</Label>
                        <Input
                          type="number"
                          value={item.duration_days}
                          onChange={(e) => updatePrescriptionItem(index, 'duration_days', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 7"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updatePrescriptionItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 14"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Cost per Unit</Label>
                        <Input
                          type="number"
                          value={item.cost_per_unit}
                          onChange={(e) => updatePrescriptionItem(index, 'cost_per_unit', parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 10.50"
                        />
                      </div>
                    </div>
                    {prescription.items.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removePrescriptionItem(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={addPrescriptionItem} className="mt-2">Add Prescription</Button>
              </div>
              <Button
                className="w-full bg-success text-success-foreground hover:bg-success/90"
                onClick={handlePrescriptionSubmit}
              >
                Submit Prescription
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Reject Appointment</DialogTitle>
          </DialogHeader>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Appointment ID</Label>
            <Input value={rejectAppointmentId || ''} readOnly />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Reason for Rejection</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false);
              setRejectReason('');
              setRejectAppointmentId(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitRejection}
              disabled={!rejectReason}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};