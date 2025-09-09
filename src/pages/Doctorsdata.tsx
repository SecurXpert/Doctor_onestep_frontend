import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/components/AuthContext';

interface DoctorData {
  doctor_id: string;
  doctor_name: string;
  email: string;
  phone: string;
  address: string;
  consultation_fee: number;
  degree: string;
  about: string;
  image: string;
  specialization_id: string;
  specialization_name: string;
  experience_years: number;
  work_location: string;
  clinic_location: string;
  // Add any additional fields from your API response
}

const Doctorsdata: React.FC = () => {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState<string>('');
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    address: '',
    consultation_fee: 0,
    degree: '',
    about: '',
    image: '',
    email: '',
    phone: '',
    experience_years: 0,
    work_location: '',
    clinic_location: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFetchDoctor = async () => {
    try {
      setError('');
      setSuccess('');
      const response = await axios.get<DoctorData>(
<<<<<<< HEAD
        `https://api.onestepmedi.com:8000/doctors/profile/${doctorId || user?.doctor_id}`
=======
        `http://192.168.0.111:10000/doctors/profile/${doctorId || user?.doctor_id}`
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
      );
      setDoctorData(response.data);
      setFormData({
        address: response.data.address,
        consultation_fee: response.data.consultation_fee,
        degree: response.data.degree,
        about: response.data.about,
        image: response.data.image,
        email: response.data.email,
        phone: response.data.phone,
        experience_years: response.data.experience_years,
        work_location: response.data.work_location,
        clinic_location: response.data.clinic_location
      });
    } catch (err) {
      setError('Failed to fetch doctor data. Please check the ID and try again.');
      setDoctorData(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'consultation_fee' || name === 'experience_years' ? Number(value) : value
    }));
  };

  const handleUpdateDoctor = async () => {
    try {
      setError('');
      setSuccess('');
      await axios.put(
<<<<<<< HEAD
        `https://api.onestepmedi.com:8000/doctors/profile/${doctorId || user?.doctor_id}`,
=======
        `http://192.168.0.111:10000/doctors/profile/${doctorId || user?.doctor_id}`,
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
        formData
      );
      setSuccess('Doctor profile updated successfully!');
      setIsEditing(false);
      handleFetchDoctor(); // Refresh data after update
    } catch (err) {
      setError('Failed to update doctor data. Please try again.');
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  // Auto-fetch doctor data if user is logged in
  React.useEffect(() => {
    if (user?.doctor_id) {
      setDoctorId(user.doctor_id);
      handleFetchDoctor();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Doctor Profile Management</h1>

        {/* ID Input and Fetch Button - Only show if not logged in */}
        {!user?.doctor_id && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Doctor ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Doctor ID"
              />
              <button
                onClick={handleFetchDoctor}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Get
              </button>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Doctor Data Display */}
        {doctorData && (
          <div className="space-y-4">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {doctorData.doctor_name}</p>
                    <p><strong>Specialization:</strong> {doctorData.specialization_name}</p>
                    <p><strong>Address:</strong> {doctorData.address}</p>
                    <p><strong>Consultation Fee:</strong> ${doctorData.consultation_fee}</p>
                    <p><strong>Degree:</strong> {doctorData.degree}</p>
                    <p><strong>About:</strong> {doctorData.about}</p>
                  </div>
                  <div>
                    <p><strong>Email:</strong> {doctorData.email}</p>
                    <p><strong>Phone:</strong> {doctorData.phone}</p>
                    <p><strong>Specialization ID:</strong> {doctorData.specialization_id}</p>
                    <p><strong>Experience:</strong> {doctorData.experience_years} years</p>
                    <p><strong>Work Location:</strong> {doctorData.work_location}</p>
                    <p><strong>Clinic Location:</strong> {doctorData.clinic_location}</p>
                  </div>
                </div>
                {doctorData.image && (
                  <div className="mt-4">
                    <img src={doctorData.image} alt="Doctor" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
                <button
                  onClick={toggleEditMode}
                  className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Consultation Fee</label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Experience Years</label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Work Location</label>
                  <input
                    type="text"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Clinic Location</label>
                  <input
                    type="text"
                    name="clinic_location"
                    value={formData.clinic_location}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateDoctor}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctorsdata;