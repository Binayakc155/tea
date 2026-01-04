'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const saveDonation = async () => {
      const pending = localStorage.getItem('lastPurchase');
      if (!pending) return;

      const purchase = JSON.parse(pending);

      const { error } = await supabaseClient.from('donations').insert({
        quantity: purchase.quantity,
        name: purchase.name,
        message: purchase.message || null,
        amount: purchase.quantity * 50 , // Rs to paisa
      });

      if (error) {
        console.error('Failed to save donation:', error);
        // Optional: show error to user
      } else {
        console.log('Donation saved successfully!');
      }

      // Clean up
      localStorage.removeItem('lastPurchase');
    };

    saveDonation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader className="pb-8">
          <div className="mx-auto w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl">☕</span>
          </div>
          <CardTitle className="text-4xl font-bold text-green-800">
            Thank You! ❤️
          </CardTitle>
          <CardDescription className="text-xl mt-4 text-green-700">
            Your tea is brewing... I truly appreciate your support!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Thanks to kind people like you, I can keep creating.
          </p>
          <div className="py-6">
            <p className="text-6xl font-bold text-green-600 animate-pulse">
              ☕
            </p>
          </div>
        </CardContent>

        <CardContent>
          <Link href="/">
            <Button size="lg" className="w-full text-lg">
              Back Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}