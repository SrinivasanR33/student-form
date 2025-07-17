import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;
const client = twilio(accountSid, authToken);

const otpStore = new Map();

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phoneNumber, otp);

  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: twilioPhone,
      to: phoneNumber,
    });
    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
