import mongoose from 'mongoose'

export const ConnetMongoDB = async () => {
  try {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close()
    }
    return await mongoose.connect(process.env.MONGODB_URI_MULTIRED)
  } catch (error) {
    console.log('MongoDB connection error', error)
    throw new Error('MongoDB connection error')
  }
}

export const ConnetMongoServired = async () => {
  try {
    if (mongoose.connection.readyState) {
      await mongoose.connection.close()
    }
    return await mongoose.connect(process.env.MONGODB_URI_SERVIRED)
  } catch (error) {
    console.log('MongoDB connection error', error)
    throw new Error('MongoDB connection error')
  }
}
