// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY!;

export async function POST(req: Request) {
  await dbConnect();

  const { phoneNumber, otp, sessionId } = await req.json();

  if (!TWO_FACTOR_API_KEY || !JWT_SECRET) {
    return NextResponse.json({ success: false, message: 'Missing API keys' }, { status: 500 });
  }

  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

  // Verify OTP using 2Factor.in
  const verifyUrl = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
  const response = await fetch(verifyUrl);
  const data = await response.json();

  if (data.Status !== 'Success') {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
  }

  // Find and verify user
  let user = await User.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    // Optionally auto-create user if needed
    user = await User.create({ phoneNumber: phoneNumber, verified: true });
  } else {
    user.verified = true;
    await user.save();
  }

  const token = jwt.sign(
    {
      userId: user._id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return NextResponse.json({
    success: true,
    message: 'User verified',
    user,
    token,
  });
}
