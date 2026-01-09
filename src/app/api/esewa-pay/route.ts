import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const merchantCode = process.env.ESEWA_MERCHANT_CODE;
  const merchantSecret = process.env.ESEWA_MERCHANT_SECRET;

  if (!merchantCode || !merchantSecret) {
    return NextResponse.json(
      { error: 'Merchant credentials not configured' },
      { status: 500 }
    );
  }

  const { quantity } = await request.json();

  // Fetch current price from settings (fallback to 50 if missing)
  let basePrice = 50;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('price_per_cup')
      .eq('id', 1)
      .single();

    if (settingsError) {
      console.error('Settings fetch error:', settingsError);
    } else if (settings?.price_per_cup) {
      basePrice = settings.price_per_cup;
    }
  } catch (err) {
    console.error('Settings fetch failure:', err);
  }

  const amount = (quantity * basePrice).toString();
  const tax_amount = "0";
  const total_amount = amount;
  const transaction_uuid = crypto.randomUUID();
  const product_code = merchantCode;

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = CryptoJS.HmacSHA256(message, merchantSecret);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  const success_url = process.env.NODE_ENV === 'production' 
    ? 'https://tea-lake.vercel.app/success' 
    : 'http://localhost:3000/success';
  const failure_url = process.env.NODE_ENV === 'production' 
    ? 'https://tea-lake.vercel.app' 
    : 'http://localhost:3000';

  return NextResponse.json({
    amount,
    tax_amount,
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url,
    failure_url,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
    quantity, // Pass back to use later if needed
  });
}