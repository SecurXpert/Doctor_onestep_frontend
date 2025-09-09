// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Lead {
//   id: number;
//   doctor_id: string;
//   name: string;
//   phone_number: string;
//   mail: string;
//   message: string;
// }

// const Leads: React.FC = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [doctorId, setDoctorId] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLeads = async (id: string) => {
//     setLoading(true);
//     setError(null);
//     try {
<<<<<<< HEAD
//       const response = await axios.get(`https://api.onestepmedi.com:8000/dm-leads/${id}`);
=======
//       const response = await axios.get(`http://192.168.0.111:10000/dm-leads/${id}`);
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
//       setLeads(response.data);
//     } catch (err) {
//       setError('Failed to fetch leads. Please check the Doctor ID or try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (doctorId.trim()) {
//       fetchLeads(doctorId);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Doctor Leads</h1>
      
//       <div className="mb-4">
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <input
//             type="text"
//             value={doctorId}
//             onChange={(e) => setDoctorId(e.target.value)}
//             placeholder="Enter Doctor ID"
//             className="p-2 border rounded w-full max-w-md"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Search'}
//           </button>
//         </form>
//       </div>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {leads.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border">ID</th>
//                 <th className="py-2 px-4 border">Doctor ID</th>
//                 <th className="py-2 px-4 border">Name</th>
//                 <th className="py-2 px-4 border">Phone Number</th>
//                 <th className="py-2 px-4 border">Email</th>
//                 <th className="py-2 px-4 border">Message</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leads.map((lead) => (
//                 <tr key={lead.id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border">{lead.id}</td>
//                   <td className="py-2 px-4 border">{lead.doctor_id}</td>
//                   <td className="py-2 px-4 border">{lead.name}</td>
//                   <td className="py-2 px-4 border">{lead.phone_number}</td>
//                   <td className="py-2 px-4 border">{lead.mail}</td>
//                   <td className="py-2 px-4 border">{lead.message}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500">No leads found. Enter a Doctor ID to fetch leads.</p>
//       )}
//     </div>
//   );
// };

// export default Leads;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Lead {
  id: number;
  doctor_id: string;
  name: string;
  phone_number: string;
  mail: string;
  message: string;
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [doctorId, setDoctorId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const response = await axios.get(`https://api.onestepmedi.com:8000/dm-leads/${id}`);
=======
      const response = await axios.get(`http://192.168.0.111:10000/dm-leads/${id}`);
>>>>>>> cc8e6812aa9ce75feec954278081906ab6c16ac3
      console.log('API Response:', response.data); // Debugging
      setLeads(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leads. Please check the Doctor ID or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId.trim()) {
      setError('Please enter a valid Doctor ID');
      return;
    }
    fetchLeads(doctorId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Leads</h1>
      
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            placeholder="Enter Doctor ID"
            className="p-2 border rounded w-full max-w-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {leads.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Doctor ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Phone Number</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Message</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{lead.id}</td>
                  <td className="py-2 px-4 border">{lead.doctor_id}</td>
                  <td className="py-2 px-4 border">{lead.name}</td>
                  <td className="py-2 px-4 border">{lead.phone_number}</td>
                  <td className="py-2 px-4 border">{lead.mail}</td>
                  <td className="py-2 px-4 border">{lead.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No leads found. Enter a Doctor ID to fetch leads.</p>
      )}
    </div>
  );
};

export default Leads;