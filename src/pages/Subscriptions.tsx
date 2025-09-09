import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface Subscription {
  plan: string;
  status: string;
  nextBillingDate: string;
}

export const Subscriptions: React.FC = () => {
  const [subscription] = useState<Subscription>({
    plan: 'Standard',
    status: 'Active until September 30, 2025',
    nextBillingDate: '',
  });

  const handleSwitchToBasic = () => {
    // TODO: Implement switch to Basic plan logic
    console.log('Switch to Basic clicked');
  };

  const handleSwitchToPremium = () => {
    // TODO: Implement switch to Premium plan logic
    console.log('Switch to Premium clicked');
  };

  return (
    <div className="p-6 max-w-10xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            My Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Current Plan: Standard</h3>
            <p className="text-sm text-muted-foreground">Status: {subscription.status}</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSwitchToBasic}>Switch to Basic</Button>
            <Button variant="outline" disabled>Your current plan</Button>
            <Button onClick={handleSwitchToPremium}>Switch to Premium</Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Payment History</h3>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TXN2023081</td>
                  <td>Aug 1, 2023</td>
                  <td>₹1000</td>
                  <td>Card</td>
                  <td>Successful</td>
                </tr>
                <tr>
                  <td>TXN20370701</td>
                  <td>July 1, 2023</td>
                  <td>₹1000</td>
                  <td>Card</td>
                  <td>Successful</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};