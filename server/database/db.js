import mongoose from 'mongoose';

export const connectDB = async () => {
  try{
    const uri = process.env.MONGO_URI
    if (!uri) {
      throw new Error("Missing MONGO_URI environment variable")
    }

    mongoose.set("strictQuery", true)

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    })

    console.log("MongoDB Connected Successfully")
    
  } catch (error) {
    console.error("MongoDB connection failed:", error?.message || error)
    if (process.env.NODE_ENV === "production") {
      console.error("Check Atlas IP allowlist, DB user credentials, and that MONGO_URI uses mongodb+srv://")
    }
    process.exit(1)
  }
}