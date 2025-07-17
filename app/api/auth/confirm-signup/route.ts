import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {getOtp,clearOtp} from '@/lib/otpStore';

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, phoneNumber, otp } = await req.json();

  const validOtp = getOtp(phoneNumber);
  if (otp !== validOtp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' });
  }

  clearOtp(phoneNumber);

  const user = await User.create({ name, email, phoneNumber });
  return NextResponse.json({ success: true, user });
}
