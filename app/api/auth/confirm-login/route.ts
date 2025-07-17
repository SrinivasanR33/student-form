import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/utils/jwt';
import {getOtp,clearOtp} from '@/lib/otpStore';

export async function POST(req: Request) {
  await dbConnect();
  const { phoneNumber, otp } = await req.json();

  const validOtp = getOtp(phoneNumber);
  if (otp !== validOtp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' });
  }

  clearOtp(phoneNumber);

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" });
  }

  const token = generateToken({ id: user._id, phoneNumber });
  return NextResponse.json({ success: true, token });
}
