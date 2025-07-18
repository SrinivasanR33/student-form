import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenData } from '@/utils/jwt';
import mongoose from 'mongoose';
// At the top of your API file, before using User

export async function GET(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const userData = getTokenData(token);

  if (!userData?.userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
console.log(userData.userId)
  const user = await User.findById(userData.userId);

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, form: user });
}


export async function POST(req: Request) {
    
  await dbConnect();
  const token = req.headers.get('authorization')?.split(' ')[1];
  const userData = getTokenData(token);
  const formData = await req.json();
console.log(userData,formData)
 const user = await User.collection.findOneAndUpdate(
  { _id: new mongoose.Types.ObjectId(userData.userId) },
  { $set: { ...formData, submitted: true } },
  { returnDocument: 'after' }
);
console.log(user,"user")
  return NextResponse.json({ success: true, form: user });
}