import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  verified:Boolean,
  phoneNumber: { type: String, unique: true },
}, { timestamps: true });

export default models.User || model('User', userSchema);