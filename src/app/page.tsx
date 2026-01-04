'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Moon, Sun } from 'lucide-react'; // Add this import for theme icons (install lucide-react if needed)
import { supabaseClient } from '@/lib/supabase/client'; // Add this import!
import Link from 'next/link';

export default function Home() {


  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme class to html root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Tea count from Supabase
  const [teaCount, setTeaCount] = useState<number>(0);

  // Recent supporters from Supabase
  const [recentSupporters, setRecentSupporters] = useState<Array<{
    name: string;
    quantity: number;
    time: string;
  }>>([]);

  // Form state
  const [quantity, setQuantity] = useState(1);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);

  const basePrice = 50;
  const totalPrice = quantity * basePrice;

  // Fetch tea count and recent supporters from Supabase on load
  useEffect(() => {
    async function fetchData() {
      // Fetch total tea count (sum of quantity)
      const { data: donationsData, error: countError } = await supabaseClient
        .from('donations')
        .select('quantity');

      if (countError) {
        console.error('Error fetching tea count:', countError);
      } else {
        const total = donationsData.reduce((sum, d) => sum + d.quantity, 0);
        setTeaCount(total);
      }

      // Fetch recent supporters (latest 10)
      const { data: supportersData, error: supportersError } = await supabaseClient
        .from('donations')
        .select('name, quantity, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (supportersError) {
        console.error('Error fetching recent supporters:', supportersError);
      } else {
        const formattedSupporters = supportersData.map(sup => ({
          name: sup.name,
          quantity: sup.quantity,
          time: new Date(sup.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        }));
        setRecentSupporters(formattedSupporters);
      }
    }
    fetchData();
  }, []);

  const handleBuyTea = async () => {
    if (!isAnonymous && senderName.trim() === '') {
      setNameError(true);
      alert('Please enter your name or check "Make me anonymous"');
      return;
    }
    setNameError(false);
    setLoading(true);

    try {
      const res = await fetch('/api/esewa-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      localStorage.setItem('lastPurchase', JSON.stringify({
        quantity,
        name: isAnonymous ? 'Anonymous' : senderName.trim() || 'Someone',
        message: message.trim(),
      }));

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'quantity') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert('Payment failed to start');
      setLoading(false);
    }
  };

  // Update count and supporters on success redirect
  useEffect(() => {
    const pending = localStorage.getItem('lastPurchase');
    if (pending) {
      const purchase = JSON.parse(pending);
      const newCount = teaCount + purchase.quantity;
      setTeaCount(newCount);

      const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const newSupporter = {
        name: purchase.name,
        quantity: purchase.quantity,
        time,
      };
      const updated = [newSupporter, ...recentSupporters].slice(0, 10);
      setRecentSupporters(updated);

      localStorage.removeItem('lastPurchase');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
            <span className="text-xl">☕</span>
            <span>Buy-Tea</span>
          </div>

          {/* Theme Toggle + Login */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-300" />}
            </button>

            <Link href="/admin/login">
              <button className="text-sm font-medium border px-4 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
                Admin Login
              </button>
            </Link>
          </div>

        </div>
      </nav>


      {/* Cover */}
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/cover.jpg')" }}
      >
        <div className="h-full w-full bg-black/30" />
      </div>

      {/* Profile strip */}
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="px-6 relative">
          <div className="flex items-center gap-4 -mt-16 pb-6 h-16"> {/* Container height fixed */}

            {/* Profile Image */}
            <div className="relative w-36 h-36 flex-shrink-0"> {/* Fixed image size */}
              <Image
                src="/profilee.jpg"
                alt="Binaya KC"
                fill
                className="rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md"
              />
            </div>

            {/* Name & bio */}
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                Binaya K.C. <span className="text-blue-500"></span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400"></p>
            </div>

            {/* Social icons */}
            <div className="ml-auto flex gap-4 text-gray-500 dark:text-gray-400 text-lg">
              <a
                href="https://www.facebook.com/binaya.kc.315"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                ❤️
              </a>

              <a
                href="https://x.com/YrWNIQdzcbMDKU7"
                target="_blank"
                rel="noopener noreferrer"
                className="m-0 social-icone si-small h-bg-x-twitter"

              >
                😂
                <i className="fa-brands bi-globe"></i>
                <i className="fa-brands bi-globe"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/binaya-kc-748647350"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 dark:hover:text-blue-500"
              >
                💼
              </a>
            </div>

          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-10">

          {/* Left column */}
          <div className="mt-6 space-y-6">

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">About</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">CS student </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="text-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Recent supports</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSupporters.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm">No supports yet</p>
                ) : (
                  recentSupporters.map((sup, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-300">
                      ☕ {sup.name} bought {sup.quantity}
                    </p>
                  ))
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right column */}
          <div className="md:col-span-2">
            <Card className="shadow-xl bg-white dark:bg-gray-800">
              <CardHeader className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Buy tea for Binaya k.c. ☕
                </h2>
              </CardHeader>

              <CardContent className="space-y-8">

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-6xl">☕</div>
                    <div className="text-4xl font-bold text-gray-500 dark:text-gray-400">×</div>

                    <ToggleGroup
                      type="single"
                      value={quantity.toString()}
                      onValueChange={(v) => v && setQuantity(parseInt(v))}
                      className="gap-4"
                    >
                      {[1, 2, 5, 10].map((num) => (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          className="w-16 h-16 rounded-full text-xl font-bold border-2 data-[state=on]:bg-[#60BB46] data-[state=on]:text-white dark:border-gray-600"
                        >
                          {num}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>

                <div className="space-y-6">

                  <div className="flex items-center justify-end gap-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(c) => {
                        setIsAnonymous(c as boolean);
                        if (c) setNameError(false);
                      }}
                      className="dark:border-gray-600"
                    />
                    < Label htmlFor="anonymous" className="text-gray-700 dark:text-gray-300">Make me anonymous</Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Full Name {!isAnonymous && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      placeholder="Full Name"
                      value={senderName}
                      onChange={(e) => {
                        setSenderName(e.target.value);
                        setNameError(false);
                      }}
                      disabled={isAnonymous}
                      className={`${nameError ? 'border-red-500' : ''} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Message for creator</Label>
                    <Input
                      placeholder="Say something nice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  </div>

                  <Button
                    size="lg"
                    onClick={handleBuyTea}
                    disabled={loading}
                    className="w-full py-6 text-xl font-bold bg-[#60BB46] hover:bg-[#4e9a38]"
                  >
                    {loading ? 'Processing...' : `Pay Rs ${totalPrice}`}
                  </Button>

                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}