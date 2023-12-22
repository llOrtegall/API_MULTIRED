import mongoose from 'mongoose'

export const ConnetMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB connection error', error)
    throw new Error('MongoDB connection error')
  }
}
