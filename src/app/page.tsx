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
import { Moon, Sun, Facebook, Twitter, Linkedin } from 'lucide-react'; // Add this import for theme icons (install lucide-react if needed)
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

  // Profile data from Supabase
  const [profile, setProfile] = useState<{
    name: string;
    bio: string | null;
    about: string | null;
    profile_pic: string | null;
  }>({
    name: 'Binaya K.C.',
    bio: null,
    about: 'CS student',
    profile_pic: '/profilee.jpg',
  });

  // Form state
  const [quantity, setQuantity] = useState(1);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);

  const [basePrice, setBasePrice] = useState<number>(50);
  const totalPrice = quantity * basePrice;

  // Fetch tea count and recent supporters from Supabase on load
  useEffect(() => {
    async function fetchData() {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profile')
        .select('name, bio, about, profile_pic')
        .eq('id', 1)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile({
          name: profileData.name || 'Binaya K.C.',
          bio: profileData.bio ?? null,
          about: profileData.about ?? null,
          profile_pic: profileData.profile_pic || '/profilee.jpg',
        });
      }

      // Fetch price per cup
      const { data: settingsData, error: settingsError } = await supabaseClient
        .from('settings')
        .select('price_per_cup')
        .eq('id', 1)
        .single();

      if (settingsError) {
        console.error('Error fetching price:', settingsError);
      } else if (settingsData?.price_per_cup) {
        setBasePrice(settingsData.price_per_cup);
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">

      {/* Top Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 font-bold text-gray-900 dark:text-white text-lg">
            <span className="text-2xl">☕</span>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Buy Tea</span>
          </div>

          {/* Theme Toggle + Login */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-300" />}
            </button>

            <Link href="/admin/login">
              <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105">
                Admin
              </button>
            </Link>
          </div>

        </div>
      </nav>


      {/* Cover */}
      <div
        className="h-48 md:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: "url('/cover.jpg')" }}
      >
        <div className="h-full w-full bg-gradient-to-b from-black/20 to-black/40" />
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 pb-8">

            {/* Profile Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <Image
                src={profile.profile_pic || '/profilee.jpg'}
                alt={profile.name || 'Profile photo'}
                fill
                className="rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
              />
            </div>

            {/* Name, Bio & Social */}
            <div className="flex-1 mt-6 md:mt-10">
              <h1 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {profile.name || 'Binaya K.C.'}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">{profile.bio }</p>

              {/* Social icons */}
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/binaya.kc.315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href="https://x.com/YrWNIQdzcbMDKU7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                >
                  <Twitter size={20} />
                </a>

                <a
                  href="https://www.linkedin.com/in/binaya-kc-748647350"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Tea Counter */}
            <div className="text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 min-w-[150px]">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Teas</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{teaCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">☕ cups</p>
            </div>

          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Sidebar */}
          <div className="space-y-6">

            {/* About Card */}
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.about || 'CS student'}</p>
              </CardContent>
            </Card>

            {/* Recent Supporters Card */}
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Supporters</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 10 supporters</p>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {recentSupporters.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">Be the first to support! </p>
                ) : (
                  recentSupporters.map((sup, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">☕</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{sup.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{sup.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">×{sup.quantity}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Content - Buy Tea Card */}
          <div className="md:col-span-2">
            <Card className="shadow-2xl bg-white dark:bg-slate-800 border-0">
              <CardHeader className="text-center pb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Buy Tea ☕
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Support {profile.name || 'the creator'} with a cup of tea</p>
              </CardHeader>

              <CardContent className="space-y-8">

                {/* Tea Quantity Selector */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8">
                  <p className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 mb-6">Select quantity</p>
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="text-5xl">☕</div>
                    <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">×</div>

                    <ToggleGroup
                      type="single"
                      value={quantity.toString()}
                      onValueChange={(v) => v && setQuantity(parseInt(v))}
                      className="gap-3"
                    >
                      {[1, 2, 5, 10].map((num) => (
                        <ToggleGroupItem
                          key={num}
                          value={num.toString()}
                          className="w-14 h-14 rounded-full text-lg font-bold border-2 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-gray-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-green-500 data-[state=on]:to-blue-600 data-[state=on]:text-white data-[state=on]:border-0 transition-all hover:scale-105"
                        >
                          {num}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">

                  {/* Anonymous Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(c) => {
                        setIsAnonymous(c as boolean);
                        if (c) setNameError(false);
                      }}
                      className="dark:border-gray-600"
                    />
                    <Label htmlFor="anonymous" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                      Keep me anonymous
                    </Label>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200 font-semibold">
                      Your Name {!isAnonymous && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      placeholder="Enter your name"
                      value={senderName}
                      onChange={(e) => {
                        setSenderName(e.target.value);
                        setNameError(false);
                      }}
                      disabled={isAnonymous}
                      className={`py-3 rounded-lg border-2 transition-all ${
                        nameError
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-500'
                      } dark:bg-slate-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200 font-semibold">
                      Message (Optional)
                    </Label>
                    <Input
                      placeholder="Say something nice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={150}
                      className="py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-500 dark:bg-slate-700 dark:text-gray-200 transition-all"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{message.length}/150</p>
                  </div>

                  {/* Pay Button */}
                  <div className="pt-4 space-y-3">
                    <Button
                      size="lg"
                      onClick={handleBuyTea}
                      disabled={loading}
                      className="w-full py-6 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Processing...
                        </span>
                      ) : (
                        `Pay Rs ${totalPrice} • ${quantity} ${quantity === 1 ? 'Tea' : 'Teas'}`
                      )}
                    </Button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">Secured by eSewa Payment</p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}