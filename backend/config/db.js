import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Create backend/.env from backend/.env.example and add your Atlas connection string.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
