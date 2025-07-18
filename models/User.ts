import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  verified: { type: Boolean },
  phoneNumber: { type: String, unique: true },
  degree: { type: String },
  age: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  submitted: { type: Boolean, default: false }
}, { timestamps: true,strict: false  });

export default models.User || model('User', userSchema);
