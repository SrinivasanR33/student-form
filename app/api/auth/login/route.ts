
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY!;

export async function POST(req: Request) {
  await dbConnect();
  const { phoneNumber } = await req.json();

  if (!TWO_FACTOR_API_KEY) {
    return NextResponse.json({ success: false, message: "2Factor API key missing" }, { status: 500 });
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" });
  }

  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

  // Send OTP using 2Factor.in
  const res = await fetch(`https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${formattedPhone}/AUTOGEN`);
  const data = await res.json();
console.log("OTP API Response →", data);
  if (data.Status !== 'Success') {
    return NextResponse.json({ success: false, message: data.Details || 'OTP send failed' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "OTP sent via 2Factor",
    sessionId: data.Details, // Save this on client side for verify step
  });
}
