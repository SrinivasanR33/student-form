// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const serviceSid = process.env.TWILIO_SERVICE_ID!;

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, phoneNumber } = await req.json();

  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    return NextResponse.json({ success: false, message: 'User already exists' });
  }

  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  // 1. Save user with verified: false
  await User.create({ name, email, phoneNumber, verified: false });

  // 2. Send OTP
  await client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: formattedPhone, channel: 'sms' });

  return NextResponse.json({
    success: true,
    message: 'OTP sent for signup',
    data: { phoneNumber }
  });
}
