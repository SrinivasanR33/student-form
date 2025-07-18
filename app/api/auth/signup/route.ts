// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, phoneNumber } = await req.json();
  const apiKey = process.env.TWO_FACTOR_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: false, message: '2Factor API Key not configured' }, { status: 500 });
  }

  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    return NextResponse.json({ success: false, message: 'User already exists' });
  }

  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

  // Step 1: Save user with verified: false
  const newUser = await User.create({
    name,
    email,
    phoneNumber: phoneNumber,
    verified: false
  });

  // Step 2: Send OTP via 2Factor
  const otpRes = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/AUTOGEN`);
  const otpData = await otpRes.json();

  if (otpData.Status !== 'Success') {
    return NextResponse.json({ success: false, message: otpData.Details }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: 'OTP sent Successfully',
    sessionId: otpData.Details, // Needed for verification
    userId: newUser._id
  });
}
