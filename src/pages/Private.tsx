import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="p-6 max-w-10xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-muted-foreground">
            <h2>1. Introduction</h2>
            <p>We value your privacy and are committed to protecting your personal information...</p>
            <h2>2. Data Collection</h2>
            <p>We collect information you provide directly, such as when you create an account...</p>
            <h2>3. Data Usage</h2>
            <p>Your information is used to provide and improve our services...</p>
            {/* TODO: Add full privacy policy content */}
            <p className="mt-4">Last updated: August 19, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};