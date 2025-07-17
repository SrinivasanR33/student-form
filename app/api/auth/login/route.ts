import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {saveOtp} from '@/lib/otpStore';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const serviceSid = process.env.TWILIO_SERVICE_ID!;

export async function POST(req: Request) {
  await dbConnect();
  const { phoneNumber } = await req.json();

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" });
  }
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;


await client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: formattedPhone, channel: 'sms' });

  return NextResponse.json({ success: true, message: "OTP sent" });
}
