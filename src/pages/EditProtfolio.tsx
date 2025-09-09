import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PortfolioFormData {
  doctor_id: string;
  clinic_address_text: string;
  qualifications_text: string;
  awards_text: string;
  video_urls: string;
  blog_text: string;
  blog_url: string;
  certifications_text: string;
  degree_text: string;
  clinic_address_file: FileList | null;
  qualifications_file: FileList | null;
  awards_file: FileList | null;
  profile_img_left: FileList | null;
  profile_img_right: FileList | null;
  certifications_file: FileList | null;
}

export const PortfolioForm = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { register, handleSubmit, formState: { errors } } = useForm<PortfolioFormData>({
    defaultValues: {
      doctor_id: '',
      clinic_address_text: '',
      qualifications_text: '',
      awards_text: '',
      video_urls: '',
      blog_text: '',
      blog_url: '',
      certifications_text: '',
      degree_text: '',
      clinic_address_file: null,
      qualifications_file: null,
      awards_file: null,
      profile_img_left: null,
      profile_img_right: null,
      certifications_file: null,
    },
  });

  const onSubmit = async (data: PortfolioFormData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      toast({
        title: "Error",
        description: "No authentication token found. Please log in again.",
        variant: "destructive",
      });
      logout();
      return;
    }

    const formData = new FormData();

    // Append text fields
    formData.append('doctor_id', data.doctor_id);
    if (data.clinic_address_text) formData.append('clinic_address_text', data.clinic_address_text);
    if (data.qualifications_text) formData.append('qualifications_text', data.qualifications_text);
    if (data.awards_text) formData.append('awards_text', data.awards_text);
    if (data.video_urls) formData.append('video_urls', data.video_urls);
    if (data.blog_text) formData.append('blog_text', data.blog_text);
    if (data.blog_url) formData.append('blog_url', data.blog_url);
    if (data.certifications_text) formData.append('certifications_text', data.certifications_text);
    if (data.degree_text) formData.append('degree_text', data.degree_text);

    // Append file fields (only if files are selected)
    if (data.clinic_address_file?.[0]) formData.append('clinic_address_file', data.clinic_address_file[0]);
    if (data.qualifications_file?.[0]) formData.append('qualifications_file', data.qualifications_file[0]);
    if (data.awards_file?.[0]) formData.append('awards_file', data.awards_file[0]);
    if (data.profile_img_left?.[0]) formData.append('profile_img_left', data.profile_img_left[0]);
    if (data.profile_img_right?.[0]) formData.append('profile_img_right', data.profile_img_right[0]);
    if (data.certifications_file?.[0]) formData.append('certifications_file', data.certifications_file[0]);

    try {
      const response = await fetch('https://api.onestepmedi.com:8000/doctor/portfolio/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = response.status === 401
          ? 'Session expired'
          : `HTTP error! status: ${response.status}${errorData.message ? ` - ${errorData.message}` : ''}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccess('Portfolio submitted successfully!');
      toast({
        title: "Success",
        description: "Portfolio submitted successfully!",
      });
      console.log('Form submitted successfully:', result);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit portfolio. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      if (errorMessage.includes('Session expired')) {
        logout();
      }
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Request for Edit Portfolio Details</h2>
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor ID */}
        <div>
          <label
            htmlFor="doctor_id"
            className="block text-sm font-medium text-foreground"
          >
            Doctor ID
          </label>
          <input
            id="doctor_id"
            type="text"
            {...register('doctor_id', { required: 'Doctor ID is required' })}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.doctor_id && 'border-destructive'
            )}
          />
          {errors.doctor_id && (
            <p className="text-destructive text-sm mt-1">{errors.doctor_id.message}</p>
          )}
        </div>

        {/* Clinic Address Text */}
        <div>
          <label
            htmlFor="clinic_address_text"
            className="block text-sm font-medium text-foreground"
          >
            Clinic Address
          </label>
          <textarea
            id="clinic_address_text"
            {...register('clinic_address_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.clinic_address_text && 'border-destructive'
            )}
          />
          {errors.clinic_address_text && (
            <p className="text-destructive text-sm mt-1">{errors.clinic_address_text.message}</p>
          )}
        </div>

        {/* Qualifications Text */}
        <div>
          <label
            htmlFor="qualifications_text"
            className="block text-sm font-medium text-foreground"
          >
            Qualifications
          </label>
          <textarea
            id="qualifications_text"
            {...register('qualifications_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.qualifications_text && 'border-destructive'
            )}
          />
          {errors.qualifications_text && (
            <p className="text-destructive text-sm mt-1">{errors.qualifications_text.message}</p>
          )}
        </div>

        {/* Awards Text */}
        <div>
          <label
            htmlFor="awards_text"
            className="block text-sm font-medium text-foreground"
          >
            Awards
          </label>
          <textarea
            id="awards_text"
            {...register('awards_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        {/* Video URLs */}
        <div>
          <label
            htmlFor="video_urls"
            className="block text-sm font-medium text-foreground"
          >
            Video URLs
          </label>
          <input
            id="video_urls"
            type="text"
            {...register('video_urls')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
            placeholder="Comma-separated URLs"
          />
        </div>

        {/* Blog Text */}
        <div>
          <label
            htmlFor="blog_text"
            className="block text-sm font-medium text-foreground"
          >
            Blog Content
          </label>
          <textarea
            id="blog_text"
            {...register('blog_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        {/* Blog URL */}
        <div>
          <label
            htmlFor="blog_url"
            className="block text-sm font-medium text-foreground"
          >
            Blog URL
          </label>
          <input
            id="blog_url"
            type="url"
            {...register('blog_url')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        {/* Certifications Text */}
        <div>
          <label
            htmlFor="certifications_text"
            className="block text-sm font-medium text-foreground"
          >
            Certifications
          </label>
          <textarea
            id="certifications_text"
            {...register('certifications_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        {/* Degree Text */}
        <div>
          <label
            htmlFor="degree_text"
            className="block text-sm font-medium text-foreground"
          >
            Degree
          </label>
          <input
            id="degree_text"
            type="text"
            {...register('degree_text')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.degree_text && 'border-destructive'
            )}
          />
          {errors.degree_text && (
            <p className="text-destructive text-sm mt-1">{errors.degree_text.message}</p>
          )}
        </div>

        {/* File Inputs */}
        <div>
          <label
            htmlFor="clinic_address_file"
            className="block text-sm font-medium text-foreground"
          >
            Clinic Address Document
          </label>
          <input
            id="clinic_address_file"
            type="file"
            {...register('clinic_address_file')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        <div>
          <label
            htmlFor="qualifications_file"
            className="block text-sm font-medium text-foreground"
          >
            Qualifications Document
          </label>
          <input
            id="qualifications_file"
            type="file"
            {...register('qualifications_file')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        <div>
          <label
            htmlFor="awards_file"
            className="block text-sm font-medium text-foreground"
          >
            Awards Document
          </label>
          <input
            id="awards_file"
            type="file"
            {...register('awards_file')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        <div>
          <label
            htmlFor="profile_img_left"
            className="block text-sm font-medium text-foreground"
          >
            Profile Image (Left)
          </label>
          <input
            id="profile_img_left"
            type="file"
            accept="image/*"
            {...register('profile_img_left')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        <div>
          <label
            htmlFor="profile_img_right"
            className="block text-sm font-medium text-foreground"
          >
            Profile Image (Right)
          </label>
          <input
            id="profile_img_right"
            type="file"
            accept="image/*"
            {...register('profile_img_right')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        <div>
          <label
            htmlFor="certifications_file"
            className="block text-sm font-medium text-foreground"
          >
            Certifications Document
          </label>
          <input
            id="certifications_file"
            type="file"
            {...register('certifications_file')}
            className={cn(
              'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={cn(
            'w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
            'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          Save Portfolio
        </button>
      </form>
    </div>
  );
};