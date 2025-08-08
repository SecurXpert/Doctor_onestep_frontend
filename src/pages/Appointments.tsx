import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Calendar, Clock, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Token not found');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
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

const AppointmentCard = ({
  appointment,
  onReject,
  onViewDetails,
  showActions = false,
}: {
  appointment: Appointment;
  onReject?: (id: string) => void;
  onViewDetails?: (appointment: Appointment) => void;
  showActions?: boolean;
}) => (
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
        <Badge className="bg-warning text-warning-foreground">
          {appointment.rejected_reason ? 'Rejected' : 'New'}
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

      {showActions && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">Accept</Button>
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

export const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAppointmentId, setRejectAppointmentId] = useState<string | null>(null);
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

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token not found');
      const decoded: any = jwtDecode(token);
      const doctor_id = decoded?.doctor_id || decoded?.id || decoded?.sub;
      if (!doctor_id) throw new Error('Doctor ID not found in token');

      const response = await fetchWithAuth(
        `http://192.168.0.111:10000/appointments/doctor-appointments/?doctor_id=${doctor_id}`
      );
      const data = await response.json();
      if (response.ok) setAppointments(data);
      else throw new Error(data?.detail || 'Failed to fetch appointments');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientProfile = async (patientName: string): Promise<string | null> => {
    try {
      const response = await fetchWithAuth(
        `http://192.168.0.111:10000/profile/patient?name=${encodeURIComponent(patientName)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || 'Failed to fetch patient profile');
      }
      const data = await response.json();
      console.log('Fetched patient profile:', data);
      return data.patient_id || null;
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError(`Failed to fetch patient profile for ${patientName}: ${err.message}`);
      return null;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date();

  const filteredAppointments = appointments
    .filter((apt) =>
      apt.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((apt) => !apt.rejected_reason);

  const rejectedAppointments = appointments.filter((apt) => apt.rejected_reason);

  const categorized = {
    upcoming: filteredAppointments.filter(
      (apt) => new Date(apt.preferred_date) >= today
    ),
    month: filteredAppointments.filter(
      (apt) =>
        new Date(apt.preferred_date).getMonth() === today.getMonth() &&
        new Date(apt.preferred_date).getFullYear() === today.getFullYear()
    ),
    year: filteredAppointments.filter(
      (apt) => new Date(apt.preferred_date).getFullYear() === today.getFullYear()
    ),
    past: filteredAppointments.filter(
      (apt) => new Date(apt.preferred_date) < today
    ),
    rejected: rejectedAppointments,
  };

  const handleReject = async (appointmentId: string) => {
    setRejectAppointmentId(appointmentId);
    setRejectDialogOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectReason || !rejectAppointmentId) return;

    try {
      const response = await fetchWithAuth(
        `http://192.168.0.111:10000/appointments/reject/${rejectAppointmentId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ rejection_reason: rejectReason }),
        }
      );

      if (response.ok) {
        fetchAppointments();
        setRejectDialogOpen(false);
        setRejectReason('');
        setRejectAppointmentId(null);
      } else {
        alert('Rejection failed.');
      }
    } catch (err) {
      alert('Error occurred during rejection.');
    }
  };

  const handleViewDetails = async (appointment: Appointment) => {
    let patientId = appointment.patient_id;
    if (!patientId) {
      patientId = await fetchPatientProfile(appointment.name);
      if (!patientId) {
        setError(`Cannot open case study: Patient ID not found for ${appointment.name}`);
        return;
      }
    }

    setSelectedAppointment(appointment);
    setPrescription({
      appointment_id: appointment.appointment_id,
      patient_id: patientId,
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

    if (!payload.patient_id) {
      alert('Patient ID is missing. Please ensure the patient has a valid profile.');
      return;
    }

    try {
      console.log('Payload:', JSON.stringify(payload, null, 2));
      const response = await fetchWithAuth(
        'http://192.168.0.111:10000/prescription/create/',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        alert('Prescription created successfully');
        setSelectedAppointment(null);
        fetchAppointments();
        // Navigate to GetData with prescription data
        navigate('/prescriptions/new', {
          state: {
            prescription: {
              id: responseData.id || Date.now(), // Fallback to timestamp if id not returned
              appointment_id: payload.appointment_id,
              doctor_id: responseData.doctor_id || 'DOC_UNKNOWN', // Adjust based on API response
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
        const errorData = await response.json();
        alert(`Failed to create prescription: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error occurred while creating prescription');
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
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Upcoming ({categorized.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              This Month ({categorized.month.length})
            </TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              This Year ({categorized.year.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Past ({categorized.past.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Rejected ({categorized.rejected.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(categorized).map(([key, appts]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <Card className="shadow-card-medical">
                <CardHeader>
                  <CardTitle className={key === 'rejected' ? 'text-destructive' : 'text-warning'}>
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
                        showActions={key === 'upcoming'}
                        onReject={handleReject}
                        onViewDetails={handleViewDetails}
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