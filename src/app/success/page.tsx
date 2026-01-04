'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Success() {
  useEffect(() => {
    // Increase tea count by 1 when success page loads
    const currentCount = parseInt(localStorage.getItem('teaCount') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('teaCount', newCount.toString());
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