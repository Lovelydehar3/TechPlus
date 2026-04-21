import mongoose from 'mongoose';

export const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    console.log("Success: MongoDB is Connected");
    
  } catch (error) {
    console.error("Error: Error connecting to MongoDB:", error.message);
    console.error("\nHint: Is MongoDB running locally? Start it with:");
    console.error("   Windows: Start 'MongoDB' from Services (services.msc)");
    console.error("   Or run: net start MongoDB\n");
    process.exit(1); // Exit process with failure
  }
}