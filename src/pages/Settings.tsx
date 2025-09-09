import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Profile  from '@/components/'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileContent = () => {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <p className="mt-1">{user?.name || 'John Doe'}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="mt-1">{user?.email || 'john.doe@example.com'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ChangePasswordContent = ({ formData, handleInputChange, handleSubmit, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PrivacyPolicyContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Our privacy policy outlines how we collect, use, and protect your personal information...</p>
      </CardContent>
    </Card>
  );
};

const TermsConditionsContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>By using our services, you agree to the following terms and conditions...</p>
      </CardContent>
    </Card>
  );
};

const ScheduleContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p>View and manage your upcoming appointments and events...</p>
      </CardContent>
    </Card>
  );
};

const SubscriptionsContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage your active subscriptions and billing information...</p>
      </CardContent>
    </Card>
  );
};

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New password and confirm password don't match");
      }
      if (formData.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile' },
    { id: 'password', label: 'Change Password' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'subscriptions', label: 'My Subscriptions' },
  ];

  return (
    <div className="container mx-auto p-4 flex min-h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <nav className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`w-full text-left p-2 rounded ${
                activeTab === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-4">
        {activeTab === 'profile' && <ProfileContent />}
        {activeTab === 'password' && (
          <ChangePasswordContent
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'privacy' && <PrivacyPolicyContent />}
        {activeTab === 'terms' && <TermsConditionsContent />}
        {activeTab === 'schedule' && <ScheduleContent />}
        {activeTab === 'subscriptions' && <SubscriptionsContent />}
      </div>
    </div>
  );
};