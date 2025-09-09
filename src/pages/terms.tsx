import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="p-6 max-w-10xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-muted-foreground">
            <h2>1. Introduction</h2>
            <p>Welcome to our platform. These Terms and Conditions govern your use of our services...</p>
            <h2>2. User Responsibilities</h2>
            <p>You agree to provide accurate information and maintain the security of your account...</p>
            <h2>3. Service Usage</h2>
            <p>Our services are provided as-is, and we reserve the right to modify or discontinue...</p>
            {/* TODO: Add full terms content */}
            <p className="mt-4">Last updated: August 19, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};