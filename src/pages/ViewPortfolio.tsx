import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHospitalAlt, FaCheckCircle, FaMapMarkerAlt, FaUserMd, FaLanguage, FaRegThumbsUp, FaUsers, FaRegCommentDots } from 'react-icons/fa';
import { MdLocationCity } from 'react-icons/md';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface JwtPayload {
  id: string;
  role: string;
  exp: number;
}

interface Section {
  id: string | number;
  section_type: string;
  image_url: string;
}

interface Clinic {
  address: string;
  city: string;
  longitude: number | string;
  latitude: number | string;
  images?: string[];
}

interface Expertise {
  image_url: string;
  description?: string;
}

interface Review {
  patient_name: string;
  rating: number;
  description: string;
}

interface Video {
  video_url: string;
}

interface DoctorData {
  doctor_id: string;
  name: string;
  specialization: string;
  experience_years: number | string;
  quote: string;
  hospital: string;
  total_patients: number | string;
  status: boolean;
  profile_img_right: string;
  profile_img_left: string;
  about: string;
  label1: string;
  label2: string;
  label3: string;
}

interface Article {
  author?: string;
  title?: string;
  desc?: string;
  tag?: string;
}

const ViewPortfolio: React.FC = () => {
  const { doctor_id: doctorIdFromUrl } = useParams<{ doctor_id: string }>();
  const { user, setIsLoading, logout } = useAuth();
  const { toast } = useToast();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState('experience');
  const navigate = useNavigate();

  // Scroll to card
  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 320 + 24;
    const centerOffset = (container.offsetWidth - cardWidth) / 2;
    container.scrollTo({
      left: index * cardWidth - centerOffset,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToCard(activeIndex);
  }, [activeIndex]);

  // Extract doctor_id from token or URL
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (user && user.id) {
      setDoctorId(user.id);
    } else if (token) {
      try {
        const payload: JwtPayload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          setError('Session expired. Please log in again.');
          toast({
            title: "Error",
            description: "Session expired. Please log in again.",
            variant: "destructive",
          });
          localStorage.removeItem('authToken');
          logout();
          navigate('/login');
          return;
        }
        if (payload.id) {
          setDoctorId(payload.id);
        } else {
          setError('Doctor ID not found in token.');
          toast({
            title: "Error",
            description: "Doctor ID not found in token.",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Invalid token. Please log in again.');
        toast({
          title: "Error",
          description: "Invalid token. Please log in again.",
          variant: "destructive",
        });
        localStorage.removeItem('authToken');
        logout();
        navigate('/login');
      }
    } else if (doctorIdFromUrl) {
      setDoctorId(doctorIdFromUrl);
    } else {
      setError('No authentication token or doctor ID provided.');
      toast({
        title: "Error",
        description: "No authentication token or doctor ID provided.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, doctorIdFromUrl, navigate, logout, toast]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return;

      const token = localStorage.getItem('authToken') || user?.token;
      if (!token) {
        setError('No authentication token found. Please log in.');
        toast({
          title: "Error",
          description: "No authentication token found. Please log in.",
          variant: "destructive",
        });
        logout();
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [doctorRes, sectionsRes, clinicsRes, expertiseRes, reviewsRes, videosRes] = await Promise.all([
          axios.get(`https://api.onestepmedi.com:8000/doctors/${doctorId}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/sections/${doctorId}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/clinics/${doctorId}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/expertise/${doctorId}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/reviews/${doctorId}`, config),
          axios.get(`https://api.onestepmedi.com:8000/doctors/videos/${doctorId}`, config),
        ]);

        setDoctorData(doctorRes.data);
        setSections(Array.isArray(sectionsRes.data) ? sectionsRes.data : []);
        setClinics(Array.isArray(clinicsRes.data) ? clinicsRes.data : []);
        setExpertise(Array.isArray(expertiseRes.data) ? expertiseRes.data : []);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        const errorMessage = error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : error.response?.data?.message || error.message || 'Unknown error';
        setError(`Failed to fetch data: ${errorMessage}`);
        toast({
          title: "Error",
          description: `Failed to fetch data: ${errorMessage}`,
          variant: "destructive",
        });
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          logout();
          navigate('/login');
        }
        setDoctorData(null);
        setSections([]);
        setClinics([]);
        setExpertise([]);
        setReviews([]);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId, navigate, user, setIsLoading, logout, toast]);

  // ArticleCard component
  const ArticleCard: React.FC<{ art: Article; idx: number; isActive: boolean }> = ({ art, idx, isActive }) => (
    <div
      className={`w-[320px] shrink-0 rounded-xl shadow transition-transform duration-300 p-0 border-0 bg-white/70 flex flex-col h-[220px] relative ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-80'}`}
      style={{
        borderRadius: 18,
        boxShadow: isActive ? '0 4px 24px 0 rgba(52, 110, 208, 0.13)' : '0 1px 6px 0 rgba(52, 110, 208, 0.06)',
        border: 'none',
      }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <img
          src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
          alt="author"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <span className="text-sm font-bold text-gray-800">{art.author || 'Dr. Anita S'}</span>
          <p className="text-xs text-gray-400 pt-0.5">17 hours ago</p>
        </div>
        <span className="ml-auto">
          <span className="inline-flex items-center text-sm font-bold px-2 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800]">
            {art.tag || 'Cardio'}
          </span>
        </span>
      </div>
      <img
        src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
        alt="article visual"
        className="mx-4 mt-1 mb-2 rounded-lg object-cover h-[70px] w-[95%]"
      />
      <div className="px-4">
        <p className="font-semibold text-base leading-snug mb-0 text-gray-800">
          {art.title || '10 Early Signs of Heart Disease'}
        </p>
        <p className="text-sm text-gray-500 mb-2">{art.desc || 'When I was studying...'}</p>
      </div>
    </div>
  );

  if (error) return <div className="text-red-600 text-center p-6 text-lg">{error}</div>;
  if (!doctorData) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;

  return (
    <div className="bg-[#f7fafd] min-h-screen font-sans text-lg">
      <style>
        {`
          .larger-font {
            font-size: 1.125rem;
          }
          .larger-font h1 {
            font-size: 2rem;
          }
          .larger-font h2 {
            font-size: 1.5rem;
          }
          .larger-font h3 {
            font-size: 1.25rem;
          }
          .larger-font p, .larger-font span, .larger-font button, .larger-font li {
            font-size: 1.125rem;
          }
          .larger-font .text-xs {
            font-size: 0.875rem;
          }
          .larger-font .text-sm {
            font-size: 1rem;
          }
          .larger-font .text-base {
            font-size: 1.125rem;
          }
          .larger-font .text-lg {
            font-size: 1.25rem;
          }
          .larger-font .text-xl {
            font-size: 1.5rem;
          }
          .larger-font .text-2xl {
            font-size: 1.75rem;
          }
          .larger-font .text-3xl {
            font-size: 2rem;
          }
        `}
      </style>
      {/* Profile Header Section */}
      <div className="max-w-10xl mx-auto py-10 px-16 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md mt-6 larger-font">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-bold text-blue-700">{doctorData.name}</h1>
          <p className="text-gray-700">{doctorData.specialization}</p>
          <p className="text-gray-500 font-semibold mt-1">{doctorData.experience_years}+ years of experience</p>
          <q className="text-gray-600 italic block my-3">{doctorData.quote}</q>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <FaHospitalAlt className="text-orange-500" />
              <span className="font-medium">{doctorData.hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              <span>{doctorData.total_patients}+ patients</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="text-green-700">{doctorData.status ? 'Available' : 'Not Available'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/appointment/${doctorData.doctor_id}`);
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <img src={doctorData.profile_img_right} alt="Doctor" className="w-56 h-[250px] object-cover rounded-lg shadow-lg" />
        </div>
      </div>
      {/* Info icons row */}
      <div className="max-w-10xl mx-auto mt-4 flex flex-wrap gap-4 justify-center larger-font">
        {[
          { icon: <FaUserMd size={24} className="text-blue-500" />, label: doctorData.label1 },
          { icon: <FaLanguage size={24} className="text-orange-500" />, label: doctorData.label2 },
          { icon: <FaRegThumbsUp size={24} className="text-green-500" />, label: doctorData.label3 },
        ].map((mode, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-white px-5 py-3 rounded-lg shadow border border-gray-100">
            {mode.icon}
            <span className="font-semibold text-gray-700">{mode.label}</span>
          </div>
        ))}
      </div>
      {/* About Section */}
      <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 larger-font">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <img src={doctorData.profile_img_left} alt="Doctor" className="w-44 h-44 rounded-lg object-cover mb-2" />
          </div>
          <div className="md:w-2/3">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold px-5 py-2 rounded-tl-lg rounded-br-lg">
              <span className="text-black font-semibold">About</span>{' '}
              <span className="text-white font-medium">Dr. {doctorData.name}</span>
            </span>
            <div className="bg-white rounded-b px-2 py-2 border-l-2 border-blue-500">
              <p className="text-gray-700">{doctorData.about}</p>
              <div className="p-4">
                <div className="mt-4 flex flex-wrap gap-3">
                  {Array.isArray(sections) && sections.length > 0 ? (
                    sections.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.section_type)}
                        className={`${
                          tab.section_type === selectedTab
                            ? tab.section_type === 'experience'
                              ? 'bg-red-200 text-red-600'
                              : 'bg-blue-200 text-blue-600'
                            : tab.section_type === 'experience'
                              ? 'bg-red-100 text-red-500'
                              : 'bg-blue-100 text-blue-500'
                        } font-semibold px-4 py-1 rounded shadow cursor-pointer`}
                      >
                        {tab.section_type}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No sections available</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  {Array.isArray(sections) && sections.length > 0 ? (
                    sections
                      .filter(hosp => hosp.section_type === selectedTab)
                      .map((hosp, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                          <img src={hosp.image_url} alt={hosp.section_type} className="w-10 h-10 object-contain" />
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500">No affiliations available</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">Consult Now</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Know More !</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Clinic Location */}
      <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 larger-font">
        <h2 className="font-bold mb-3">Clinic Location</h2>
        {clinics.length > 0 ? (
          clinics.map((loc, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="font-bold">Fortis Hospital</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="font-semibold">Address:</span>
                  <span>{loc.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MdLocationCity className="text-orange-500" />
                  <span className="font-semibold">City:</span>
                  <span>{loc.city}</span>
                </div>
                <button className="bg-red-100 text-red-600 font-semibold px-4 py-2 rounded shadow mt-3">Contact Now</button>
              </div>
              <div className="flex-1 flex justify-center">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.30966200977!2d${loc.longitude}!3d${loc.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91b9b6c2e3e7%3A0x2e2b0e1c8f3f3e53!2sKrishna%20Towers%2C%20Madhapur%2C%20Hyderabad%2C%20Telangana%20500081!5e0!3m2!1sen!2sin!4v1625582550000!5m2!1sen!2sin`}
                  title="Clinic Location"
                  width="350"
                  height="200"
                  className="rounded-md border"
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No clinic locations available.</p>
        )}
      </div>
      {/* Clinic Images */}
      <div className="max-w-10xl mx-auto flex flex-wrap gap-6 mt-6 larger-font">
        {clinics.length > 0 ? (
          clinics.map((loc, idx) =>
            loc.images && loc.images.length > 0 ? (
              loc.images.map((image, imgIdx) => (
                <img
                  key={`${idx}-${imgIdx}`}
                  src={image}
                  alt={`Clinic ${idx + 1} Image ${imgIdx + 1}`}
                  className="w-[48%] h-48 object-cover rounded-lg shadow"
                />
              ))
            ) : (
              <p key={idx} className="text-gray-500">No images available for Clinic {idx + 1}</p>
            )
          )
        ) : (
          <p className="text-gray-500">No clinic images available.</p>
        )}
      </div>
      {/* Medical Expertise */}
      <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 larger-font">
        <h2 className="font-bold mb-4">Medical Expertise</h2>
        <div className="flex flex-wrap gap-4">
          {expertise.length > 0 ? (
            expertise.map((expert, idx) => (
              <div key={idx} className="flex flex-col items-center w-32 bg-gray-50 rounded-lg py-2 shadow border">
                <img src={expert.image_url} alt="Expert" className="w-16 h-16 rounded-full object-cover mb-1" />
                <span className="font-semibold text-sm">Expert {idx + 1}</span>
                <span className="text-xs text-gray-500">{expert.description || 'Content'}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No expertise information available.</p>
          )}
        </div>
      </div>
      {/* Feedback/Patients Section */}
      <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 larger-font">
        <h2 className="font-bold mb-4">
          Our Patients Feedback About <span className="text-blue-700">Dr {doctorData.name}</span>
        </h2>
        <div className="flex flex-wrap gap-6">
          {reviews.length > 0 ? (
            reviews.map((feed, idx) => (
              <div key={idx} className="flex-1 min-w-[250px] bg-gray-50 rounded-lg p-4 shadow border">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                    alt={feed.patient_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold">{feed.patient_name}</span>
                  <span className="flex gap-1 ml-2">
                    {[...Array(feed.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{feed.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
      {/* Articles and Solutions */}
      <div className="max-w-10xl mx-auto bg-gradient-to-r from-[#6ec1e4] via-[#b8d8f5] to-[#f7fafd] rounded-xl shadow-md p-6 mt-8 larger-font">
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 items-center">
          <div className="flex-[1.5] relative flex items-center min-h-[260px]">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              className="absolute left-[-18px] md:left-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
              style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
            >
              <ChevronLeft className="w-5 h-5 text-blue-700" />
            </button>
            <div ref={scrollRef} className="flex overflow-x-hidden gap-6 px-4 py-3" style={{ minWidth: 0 }}>
              {[
                { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
                { author: 'Dr. Anita S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'UX' },
                { author: 'Dr. James S', title: '10 Early Signs of Heart Disease...', desc: 'When I was studying...', tag: 'Cardio' },
              ].map((art, idx) => (
                <ArticleCard key={idx} art={art} idx={idx} isActive={idx === activeIndex} />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, 2))}
              className="absolute right-[-18px] md:right-[-30px] top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-blue-200"
              style={{ boxShadow: '0 2px 8px 0 rgba(52, 110, 208, 0.12)' }}
            >
              <ChevronRight className="w-5 h-5 text-blue-700" />
            </button>
          </div>
          <div className="md:w-[350px] w-full mt-8 md:mt-0 flex flex-col items-center">
            <h3 className="font-bold mb-3 text-gray-900 text-center md:text-left">Easy Steps and Get Your Solution</h3>
            <ul className="list-decimal list-inside text-gray-700 mb-5 text-left">
              {[
                'Identify the Issue',
                'Reach Out to the Expert',
                'Share Your Concerns',
                'Receive a Personalized Plan',
                'Follow Up and Stay Consistent',
              ].map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
            <div className="flex gap-3 w-full justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-500 text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Read More !
              </button>
              <button className="bg-[#186cc3] hover:bg-[#1559a5] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Consult Later
              </button>
              <button className="bg-[#209c38] hover:bg-[#157a29] text-white font-semibold px-5 py-1.5 rounded transition shadow">
                Connect Now !
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Video and Health Tips */}
      <div className="max-w-10xl mx-auto flex flex-col md:flex-row gap-6 mt-8 mb-10 larger-font">
        <div className="flex-1">
          <h3 className="font-bold mb-2">Dr {doctorData.name}'s Intro</h3>
          <div className="aspect-w-16 aspect-h-9">
            {videos.length > 0 ? (
              <iframe
                src={videos[0]?.video_url.replace('watch?v=', 'embed/')}
                title={`Dr ${doctorData.name}'s Intro`}
                width="100%"
                height="215"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow"
              />
            ) : (
              <p className="text-gray-500">No intro video available.</p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <FaRegCommentDots className="text-red-500" /> Health and Tips
          </h3>
          <div className="flex gap-3">
            {videos.length > 0 ? (
              videos.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow border w-32 p-2">
                  <img
                    src="https://lh3.googleusercontent.com/ogw/AF2bZyz2p4g2z7i0b5X3gY1vL1z2K8y1r4v6z7g1s2q=s32-c"
                    alt="Health Tip"
                    className="w-full h-16 rounded object-cover mb-1"
                  />
                  <div className="font-semibold">Health Tip {idx + 1}</div>
                  <div className="text-gray-400">2.{idx + 4}M Views</div>
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded mt-2">Watch More!</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No health tips available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPortfolio;