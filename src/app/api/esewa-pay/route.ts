import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(request: NextRequest) {
  const { quantity } = await request.json();
  const basePrice = 50;
  const amount = (quantity * basePrice).toString(); // e.g., 5 * 50 = 250
  const tax_amount = "0";
  const total_amount = amount;
  const transaction_uuid = crypto.randomUUID(); // Node.js crypto
  const product_code = "EPAYTEST";

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const secret = "8gBm/:&EnhH.1/q"; // Test secret – safe on server

  const hash = CryptoJS.HmacSHA256(message, secret);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  const success_url = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/success' 
    : 'http://localhost:3000/success';
  const failure_url = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
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