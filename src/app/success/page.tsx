'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function Success() {
  const [purchaseData, setPurchaseData] = useState<any>(null);

  useEffect(() => {
    const saveDonation = async () => {
      const pending = localStorage.getItem('lastPurchase');
      if (!pending) return;

      const purchase = JSON.parse(pending);
      setPurchaseData(purchase);

      await supabaseClient.from('donations').insert({
        quantity: purchase.quantity,
        name: purchase.name,
        message: purchase.message || null,
        amount: purchase.quantity * 50 * 100,
      });

      localStorage.removeItem('lastPurchase');
    };

    saveDonation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
          <CheckCircle className="w-14 h-14 text-white mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-4xl font-bold text-white mb-2">Success!</h1>
          <p className="text-green-100 text-lg">Thank you for your support</p>
        </div>

        {/* Content */}
        <div className="px-8 py-10 space-y-6">
          {purchaseData && (
            <>
              <div className="text-center py-6 bg-green-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">You Sent</p>
                <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                  {purchaseData.quantity} ☕
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{purchaseData.name}</span>
                </div>
                {purchaseData.message && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Message:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{purchaseData.message}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Your donation has been recorded. Thank you for supporting this creator!
          </p>

          <Link href="/">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Home size={20} />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}