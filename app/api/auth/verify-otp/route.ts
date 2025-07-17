// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const serviceSid = process.env.TWILIO_SERVICE_ID!;
const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: Request) {
  await dbConnect();
  const { phoneNumber, otp } = await req.json();


  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  const check = await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: formattedPhone, code: otp });

  if (check.status !== 'approved') {
    return NextResponse.json({ success: false, message: 'Invalid OTP' });
  }

  // Mark verified
   let user = await User.findOne({ phoneNumber });
  if (!user) {
    // Optionally auto-create user on verify if not present
    user = await User.create({ phoneNumber, verified: true });
  } else {
    user.verified = true;
    await user.save();
  }

  const token = jwt.sign(
    { userId: user._id, phoneNumber: user.phoneNumber,name:user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found after verification' });
  }

  return NextResponse.json({ success: true, message: 'User verified', user ,token});
}
