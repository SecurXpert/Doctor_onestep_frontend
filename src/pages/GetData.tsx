import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { fetchWithAuth } from './Appointments';

// Static data based on the provided schema
const staticPrescriptions = [
  {
    id: 1,
    appointment_id: "APT001",
    doctor_id: "DOC001",
    patient_id: "PAT001",
    generated_at: "2025-08-06T09:51:01.016Z",
    file_url: "http://example.com/prescription1.pdf",
    status: "completed",
    items: [
      {
        medicine_name: "Paracetamol",
        dosage_time: "Morning, Evening",
        duration_days: 5,
        quantity: 10,
        cost_per_unit: 1.5,
      },
      {
        medicine_name: "Amoxicillin",
        dosage_time: "Morning",
        duration_days: 7,
        quantity: 14,
        cost_per_unit: 2.0,
      },
    ],
    case_study: {
      symptoms: "Fever, cough",
      diagnosis: "Common cold",
      notes: "Rest and hydrate adequately",
    },
    tests: [
      {
        test_name: "Blood Test",
        test_description: "Complete blood count",
      },
    ],
  },
  {
    id: 2,
    appointment_id: "APT002",
    doctor_id: "DOC002",
    patient_id: "PAT002",
    generated_at: "2025-08-05T14:30:00.000Z",
    file_url: "",
    status: "pending",
    items: [
      {
        medicine_name: "Ibuprofen",
        dosage_time: "As needed",
        duration_days: 3,
        quantity: 6,
        cost_per_unit: 1.0,
      },
    ],
    case_study: {
      symptoms: "Headache",
      diagnosis: "Tension headache",
      notes: "Avoid stress, ensure sleep",
    },
    tests: [],
  },
];

interface Prescription {
  id: number;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  generated_at: string;
  file_url: string;
  status: string;
  items: {
    medicine_name: string;
    dosage_time: string;
    duration_days: number;
    quantity: number;
    cost_per_unit: number;
  }[];
  case_study: {
    symptoms: string;
    diagnosis: string;
    notes: string;
  };
  tests: {
    test_name: string;
    test_description?: string;
  }[];
}

export const GetData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(staticPrescriptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prescriptions for a specific appointment ID
  const fetchPrescriptions = async (appointmentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
<<<<<<< HEAD
        `https://api.onestepmedi.com:8000/prescription/by-appointment/${appointmentId}`
=======
        `http://192.168.0.111:10000/prescription/by-appointment/${appointmentId}`
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
      );
      const data = await response.json();
      if (response.ok) {
        // Merge API data with static data, avoiding duplicates
        setPrescriptions((prev) => {
          const newPrescriptions = data.filter(
            (newPres: Prescription) => !prev.some((p) => p.id === newPres.id)
          );
          return [...newPrescriptions, ...prev];
        });
      } else {
        throw new Error(data?.detail || 'Failed to fetch prescriptions');
      }
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new prescription from location.state
  useEffect(() => {
    if (location.state?.prescription) {
      setPrescriptions((prev) => {
        // Avoid duplicates by checking ID
        if (prev.some((p) => p.id === location.state.prescription.id)) {
          return prev;
        }
        return [location.state.prescription, ...prev];
      });
    }
    // Fetch prescriptions for a specific appointment if provided
    if (location.state?.appointmentId) {
      fetchPrescriptions(location.state.appointmentId);
    }
  }, [location.state]);

  // Filter prescriptions based on search term (patient_id or status)
  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prescription Details</h1>
        <p className="text-muted-foreground">View all prescriptions</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient ID or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredPrescriptions.length === 0 ? (
        <p className="text-muted-foreground">No prescriptions found.</p>
      ) : (
        filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="shadow-card-medical mb-4">
            <CardHeader>
              <CardTitle className="text-primary">Prescription #{prescription.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointment ID</p>
                  <p className="text-foreground">{prescription.appointment_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                  <p className="text-foreground">{prescription.patient_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Doctor ID</p>
                  <p className="text-foreground">{prescription.doctor_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Generated At</p>
                  <p className="text-foreground">{new Date(prescription.generated_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    className={
                      prescription.status === 'completed'
                        ? 'bg-success text-success-foreground'
                        : 'bg-warning text-warning-foreground'
                    }
                  >
                    {prescription.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File</p>
                  {prescription.file_url ? (
                    <a
                      href={prescription.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View File
                    </a>
                  ) : (
                    <p className="text-foreground">No file</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Case Study</p>
                <div className="border p-4 rounded-md space-y-2">
                  <p><strong>Symptoms:</strong> {prescription.case_study.symptoms || 'N/A'}</p>
                  <p><strong>Diagnosis:</strong> {prescription.case_study.diagnosis || 'N/A'}</p>
                  <p><strong>Notes:</strong> {prescription.case_study.notes || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Medicines</p>
                {prescription.items.length > 0 ? (
                  prescription.items.map((item, index) => (
                    <div key={index} className="border p-4 mb-2 rounded-md">
                      <p><strong>Medicine:</strong> {item.medicine_name}</p>
                      <p><strong>Dosage Time:</strong> {item.dosage_time}</p>
                      <p><strong>Duration:</strong> {item.duration_days} days</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Cost per Unit:</strong> ₹{item.cost_per_unit.toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No medicines prescribed.</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Diagnostic Tests</p>
                {prescription.tests.length > 0 ? (
                  prescription.tests.map((test, index) => (
                    <div key={index} className="border p-4 mb-2 rounded-md">
                      <p><strong>Test Name:</strong> {test.test_name}</p>
                      <p><strong>Description:</strong> {test.test_description || 'N/A'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No tests prescribed.</p>
                )}
              </div>

              <Button
                onClick={() => navigate('/appointments')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Back to Appointments
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};