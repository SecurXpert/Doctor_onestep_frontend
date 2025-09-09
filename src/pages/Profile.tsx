// import { useState } from 'react';
// import { useAuth } from '@/components/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { useToast } from '@/hooks/use-toast';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   Stethoscope,
//   Award,
//   Clock,
//   Save
// } from 'lucide-react';

// export const Profile = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: 'Dr. Sarah Johnson',
//     email: 'doctor@hospital.com',
//     phone: '+1 (555) 123-4567',
//     address: '123 Medical Center Drive, City, State 12345',
//     specialization: 'Internal Medicine',
//     experience: '8 years',
//     education: 'MD from Johns Hopkins University',
//     bio: 'Experienced internal medicine physician with a passion for preventive care and patient education. Committed to providing comprehensive healthcare services with compassion and excellence.',
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     // In a real app, this would save to the backend
//     setIsEditing(false);
//     toast({
//       title: "Profile Updated",
//       description: "Your profile information has been successfully updated.",
//     });
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     // Reset form data to original values
//     setFormData({
//       name: 'Dr. Sarah Johnson',
//       email: 'doctor@hospital.com',
//       phone: '+1 (555) 123-4567',
//       address: '123 Medical Center Drive, City, State 12345',
//       specialization: 'Internal Medicine',
//       experience: '8 years',
//       education: 'MD from Johns Hopkins University',
//       bio: 'Experienced internal medicine physician with a passion for preventive care and patient education. Committed to providing comprehensive healthcare services with compassion and excellence.',
//     });
//   };

//   return (
//     <div className="space-y-6 max-w-4xl">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
//         <p className="text-muted-foreground">Manage your professional profile and preferences</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Overview */}
//         <Card className="shadow-card-medical">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-center text-center space-y-4">
//               <Avatar className="h-24 w-24 border-4 border-primary/20">
//                 <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
//                   {user?.avatar || formData.name.split(' ').map(n => n[0]).join('')}
//                 </AvatarFallback>
//               </Avatar>
              
//               <div>
//                 <h2 className="text-xl font-semibold text-foreground">{formData.name}</h2>
//                 <p className="text-muted-foreground">{formData.specialization}</p>
//                 <Badge className="mt-2 bg-success text-success-foreground">
//                   Active
//                 </Badge>
//               </div>

//               <div className="w-full space-y-2 text-sm">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Mail className="h-4 w-4" />
//                   <span className="truncate">{formData.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Phone className="h-4 w-4" />
//                   <span>{formData.phone}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Clock className="h-4 w-4" />
//                   <span>{formData.experience} experience</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Profile Details */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="shadow-card-medical">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Personal Information</CardTitle>
//                 <CardDescription>Update your personal and professional details</CardDescription>
//               </div>
//               <div className="flex gap-2">
//                 {isEditing ? (
//                   <>
//                     <Button variant="outline" onClick={handleCancel}>
//                       Cancel
//                     </Button>
//                     <Button onClick={handleSave} className="gap-2">
//                       <Save className="h-4 w-4" />
//                       Save Changes
//                     </Button>
//                   </>
//                 ) : (
//                   <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medical">
//                     Edit Profile
//                   </Button>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="name"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="phone"
//                       value={formData.phone}
//                       onChange={(e) => handleInputChange('phone', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="specialization">Specialization</Label>
//                   <div className="relative">
//                     <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="specialization"
//                       value={formData.specialization}
//                       onChange={(e) => handleInputChange('specialization', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) => handleInputChange('address', e.target.value)}
//                     disabled={!isEditing}
//                     className="pl-10 min-h-[60px]"
//                   />
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                   <Award className="h-5 w-5 text-primary" />
//                   Professional Information
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="experience">Years of Experience</Label>
//                     <Input
//                       id="experience"
//                       value={formData.experience}
//                       onChange={(e) => handleInputChange('experience', e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="education">Education</Label>
//                     <Input
//                       id="education"
//                       value={formData.education}
//                       onChange={(e) => handleInputChange('education', e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Professional Bio</Label>
//                   <Textarea
//                     id="bio"
//                     value={formData.bio}
//                     onChange={(e) => handleInputChange('bio', e.target.value)}
//                     disabled={!isEditing}
//                     className="min-h-[100px]"
//                     placeholder="Tell us about your background, expertise, and approach to patient care..."
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Stats */}
//           <Card className="shadow-card-medical">
//             <CardHeader>
//               <CardTitle>Practice Overview</CardTitle>
//               <CardDescription>Your practice statistics and achievements</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="text-center p-4 rounded-lg bg-primary/10">
//                   <p className="text-2xl font-bold text-primary">1,247</p>
//                   <p className="text-sm text-muted-foreground">Total Patients</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-success/10">
//                   <p className="text-2xl font-bold text-success">98%</p>
//                   <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-warning/10">
//                   <p className="text-2xl font-bold text-warning">156</p>
//                   <p className="text-sm text-muted-foreground">This Month</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-accent/10">
//                   <p className="text-2xl font-bold text-accent">4.9</p>
//                   <p className="text-sm text-muted-foreground">Avg Rating</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };


// import { useState, useEffect } from 'react';
// import { useAuth } from '@/components/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { useToast } from '@/hooks/use-toast';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Stethoscope,
//   Award,
//   Clock,
//   Save,
//   DollarSign
// } from 'lucide-react';

// export const Profile = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     doctor_name: '',
//     email: '',
//     phone: '',
//     address: '',
//     specialization_name: '',
//     experience_years: 0,
//     degree: '',
//     about: '',
//     consultation_fee: 0,
//     work_location: '',
//     clinic_location: '',
//     image: ''
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${user.doctor_id}`, {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
//         if (!response.ok) throw new Error('Failed to fetch profile');
//         const data = await response.json();
//         setFormData({
//           doctor_name: data.doctor_name || '',
//           email: data.email || '',
//           phone: data.phone || '',
//           address: data.address || '',
//           specialization_name: data.specialization_name || '',
//           experience_years: data.experience_years || 0,
//           degree: data.degree || '',
//           about: data.about || '',
//           consultation_fee: data.consultation_fee || 0,
//           work_location: data.work_location || '',
//           clinic_location: data.clinic_location || '',
//           image: data.image || ''
//         });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load profile data",
//           variant: "destructive"
//         });
//       }
//     };

//     if (user?.doctor_id) {
//       fetchProfile();
//     }
//   }, [user, toast]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${user.doctor_id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) throw new Error('Failed to update profile');

//       setIsEditing(false);
//       toast({
//         title: "Profile Updated",
//         description: "Your profile information has been successfully updated."
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${user.doctor_id}`, {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
//         if (!response.ok) throw new Error('Failed to fetch profile');
//         const data = await response.json();
//         setFormData({
//           doctor_name: data.doctor_name || '',
//           email: data.email || '',
//           phone: data.phone || '',
//           address: data.address || '',
//           specialization_name: data.specialization_name || '',
//           experience_years: data.experience_years || 0,
//           degree: data.degree || '',
//           about: data.about || '',
//           consultation_fee: data.consultation_fee || 0,
//           work_location: data.work_location || '',
//           clinic_location: data.clinic_location || '',
//           image: data.image || ''
//         });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load profile data",
//           variant: "destructive"
//         });
//       }
//     };

//     if (user?.doctor_id) {
//       fetchProfile();
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
//         <p className="text-muted-foreground">Manage your professional profile and preferences</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Overview */}
//         <Card className="shadow-card-medical">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-center text-center space-y-4">
//               <Avatar className="h-24 w-24 border-4 border-primary/20">
//                 <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
//                   {user?.avatar || formData.doctor_name.split(' ').map(n => n[0]).join('')}
//                 </AvatarFallback>
//               </Avatar>
              
//               <div>
//                 <h2 className="text-xl font-semibold text-foreground">{formData.doctor_name}</h2>
//                 <p className="text-muted-foreground">{formData.specialization_name}</p>
//                 <Badge className="mt-2 bg-success text-success-foreground">
//                   Active
//                 </Badge>
//               </div>

//               <div className="w-full space-y-2 text-sm">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Mail className="h-4 w-4" />
//                   <span className="truncate">{formData.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Phone className="h-4 w-4" />
//                   <span>{formData.phone}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Clock className="h-4 w-4" />
//                   <span>{formData.experience_years} years experience</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Profile Details */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="shadow-card-medical">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Personal Information</CardTitle>
//                 <CardDescription>Update your personal and professional details</CardDescription>
//               </div>
//               <div className="flex gap-2">
//                 {isEditing ? (
//                   <>
//                     <Button variant="outline" onClick={handleCancel}>
//                       Cancel
//                     </Button>
//                     <Button onClick={handleSave} className="gap-2">
//                       <Save className="h-4 w-4" />
//                       Save Changes
//                     </Button>
//                   </>
//                 ) : (
//                   <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medical">
//                     Edit Profile
//                   </Button>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="doctor_name">Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="doctor_name"
//                       value={formData.doctor_name}
//                       onChange={(e) => handleInputChange('doctor_name', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="phone"
//                       value={formData.phone}
//                       onChange={(e) => handleInputChange('phone', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="specialization_name">Specialization</Label>
//                   <div className="relative">
//                     <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="specialization_name"
//                       value={formData.specialization_name}
//                       onChange={(e) => handleInputChange('specialization_name', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="consultation_fee"
//                       type="number"
//                       value={formData.consultation_fee}
//                       onChange={(e) => handleInputChange('consultation_fee', parseFloat(e.target.value))}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="work_location">Work Location</Label>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="work_location"
//                       value={formData.work_location}
//                       onChange={(e) => handleInputChange('work_location', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="clinic_location">Clinic Location</Label>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="clinic_location"
//                       value={formData.clinic_location}
//                       onChange={(e) => handleInputChange('clinic_location', e.target.value)}
//                       disabled={!isEditing}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) => handleInputChange('address', e.target.value)}
//                     disabled={!isEditing}
//                     className="pl-10 min-h-[60px]"
//                   />
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                   <Award className="h-5 w-5 text-primary" />
//                   Professional Information
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="experience_years">Years of Experience</Label>
//                     <div className="relative">
//                       <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="experience_years"
//                         type="number"
//                         value={formData.experience_years}
//                         onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
//                         disabled={!isEditing}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="degree">Education</Label>
//                     <Input
//                       id="degree"
//                       value={formData.degree}
//                       onChange={(e) => handleInputChange('degree', e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="about">Professional Bio</Label>
//                   <Textarea
//                     id="about"
//                     value={formData.about}
//                     onChange={(e) => handleInputChange('about', e.target.value)}
//                     disabled={!isEditing}
//                     className="min-h-[100px]"
//                     placeholder="Tell us about your background, expertise, and approach to patient care..."
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Practice Overview (Static) */}
//           <Card className="shadow-card-medical">
//             <CardHeader>
//               <CardTitle>Practice Overview</CardTitle>
//               <CardDescription>Your practice statistics and achievements</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="text-center p-4 rounded-lg bg-primary/10">
//                   <p className="text-2xl font-bold text-primary">1,247</p>
//                   <p className="text-sm text-muted-foreground">Total Patients</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-success/10">
//                   <p className="text-2xl font-bold text-success">98%</p>
//                   <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-warning/10">
//                   <p className="text-2xl font-bold text-warning">156</p>
//                   <p className="text-sm text-muted-foreground">This Month</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-accent/10">
//                   <p className="text-2xl font-bold text-accent">4.9</p>
//                   <p className="text-sm text-muted-foreground">Avg Rating</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };


import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope,
  Award,
  Clock,
  Save,
  DollarSign,
  Upload
} from 'lucide-react';

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

// Utility to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    doctor_name: '',
    email: '',
    phone: '',
    address: '',
    specialization_name: '',
    specialization_id: 0,
    experience_years: 0,
    degree: '',
    about: '',
    consultation_fee: 0,
    work_location: '',
    clinic_location: '',
    image: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        toast({
          title: "Error",
          description: "Please log in again",
          variant: "destructive"
        });
        logout();
        return;
      }

      // Decode token to get doctor_id
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

      try {
        const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch profile');
        }

        const data = await response.json();
        setFormData({
          doctor_id: data.doctor_id || '',
          doctor_name: data.doctor_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          specialization_name: data.specialization_name || '',
          specialization_id: data.specialization_id || 0,
          experience_years: data.experience_years || 0,
          degree: data.degree || '',
          about: data.about || '',
          consultation_fee: data.consultation_fee || 0,
          work_location: data.work_location || '',
          clinic_location: data.clinic_location || '',
          image: data.image || ''
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        if (error.message === 'Session expired') {
          logout();
        }
      }
    };

    fetchProfile();
  }, [user, toast, logout]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Image = await fileToBase64(file);
        setFormData(prev => ({ ...prev, image: base64Image }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive"
        });
      }
    }
  };

//  const handleSave = async () => {
//   if (!user?.token) {
//     toast({
//       title: "Error",
//       description: "Please log in again",
//       variant: "destructive"
//     });
//     logout();
//     return;
//   }

//   const decodedToken = decodeToken(user.token);
//   const doctorId = decodedToken?.id;

//   if (!doctorId) {
//     toast({
//       title: "Error",
//       description: "Invalid token. Please log in again.",
//       variant: "destructive"
//     });
//     logout();
//     return;
//   }

//   try {
//     const formDataToSend = new FormData();
    
//     // Append all fields to FormData
//     formDataToSend.append('doctor_id', formData.doctor_id);
//     formDataToSend.append('doctor_name', formData.doctor_name);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('phone', formData.phone);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('specialization_name', formData.specialization_name);
//     formDataToSend.append('specialization_id', formData.specialization_id.toString());
//     formDataToSend.append('experience_years', formData.experience_years.toString());
//     formDataToSend.append('degree', formData.degree);
//     formDataToSend.append('about', formData.about);
//     formDataToSend.append('consultation_fee', formData.consultation_fee.toString());
//     formDataToSend.append('work_location', formData.work_location);
//     formDataToSend.append('clinic_location', formData.clinic_location);
    
//     // Handle image separately if it's a new file
//     if (formData.image.startsWith('data:image')) {
//       // Convert base64 to blob
//       const blob = await fetch(formData.image).then(res => res.blob());
//       formDataToSend.append('image', blob, 'profile.jpg');
//     }

//     const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${doctorId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${user.token}`
//       },
//       body: formDataToSend
//     });

//     if (!response.ok) {
//       throw new Error(response.status === 401 ? 'Session expired' : `Failed to update profile: ${response.statusText}`);
//     }

//     setIsEditing(false);
//     toast({
//       title: "Success",
//       description: "Profile updated successfully"
//     });
//   } catch (error) {
//     toast({
//       title: "Error",
//       description: error.message,
//       variant: "destructive"
//     });
//     if (error.message === 'Session expired') {
//       logout();
//     }
//   }
// };

const handleSave = async () => {
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

  try {
    const formDataToSend = new FormData();
    
    // Append all fields to FormData - ensure all values are strings
    Object.entries(formData).forEach(([key, value]) => {
      // Skip the image field as we'll handle it separately
      if (key !== 'image') {
        formDataToSend.append(key, String(value));
      }
    });
    
    // Handle image separately if it's a new file
    if (formData.image && formData.image.startsWith('data:image')) {
      // Convert base64 to blob
      const blob = await fetch(formData.image).then(res => res.blob());
      formDataToSend.append('image', blob, 'profile.jpg');
    }

    const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${doctorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        response.status === 401 
          ? 'Session expired' 
          : `Failed to update profile: ${errorData.message || response.statusText}`
      );
    }

    const updatedData = await response.json();
    
    // Update local state with the response data
    setFormData(prev => ({
      ...prev,
      ...updatedData
    }));

    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully"
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
    if (error.message === 'Session expired') {
      logout();
    }
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally, refetch profile to reset formData
    fetchProfile();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your professional profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="shadow-card-medical">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={formData.image} alt="Profile" />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                    {user?.avatar || formData.doctor_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:opacity-80"
                  >
                    <Upload className="h-4 w-4" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-foreground">{formData.doctor_name}</h2>
                <p className="text-muted-foreground">{formData.specialization_name}</p>
                <Badge className="mt-2 bg-success text-success-foreground">
                  Active
                </Badge>
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formData.experience_years} years experience</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card-medical">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal and professional details</CardDescription>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medical">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="doctor_name"
                      value={formData.doctor_name}
                      onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization_name">Specialization</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="specialization_name"
                      value={formData.specialization_name}
                      onChange={(e) => handleInputChange('specialization_name', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization_id">Specialization ID</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="specialization_id"
                      type="number"
                      value={formData.specialization_id}
                      onChange={(e) => handleInputChange('specialization_id', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="consultation_fee"
                      type="number"
                      value={formData.consultation_fee}
                      onChange={(e) => handleInputChange('consultation_fee', parseFloat(e.target.value))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_location">Work Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="work_location"
                      value={formData.work_location}
                      onChange={(e) => handleInputChange('work_location', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic_location">Clinic Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="clinic_location"
                      value={formData.clinic_location}
                      onChange={(e) => handleInputChange('clinic_location', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 min-h-[60px]"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Education</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">Professional Bio</Label>
                  <Textarea
                    id="about"
                    value={formData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                    placeholder="Tell us about your background, expertise, and approach to patient care..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Overview (Static) */}
          <Card className="shadow-card-medical">
            <CardHeader>
              <CardTitle>Practice Overview</CardTitle>
              <CardDescription>Your practice statistics and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-2xl font-bold text-primary">1,247</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-2xl font-bold text-success">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <p className="text-2xl font-bold text-warning">156</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-2xl font-bold text-accent">4.9</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};