import mongoose from 'mongoose';

const cleanMongoUri = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^["']|["']$/g, "")

const maskMongoUri = (uri) => {
  try {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "https://"))
    return `${parsed.username || "?"}:***@${parsed.hostname}${parsed.pathname || ""}`
  } catch {
    return "(invalid URI format)"
  }
}

export const connectDB = async () => {
  const connect = async (uri) => {
    await mongoose.connect(uri, {
      // Connection pooling settings for better performance
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 45000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      // Optimizations
      family: 4 // Use IPv4, more stable than IPv6
    });
  };

  try{
    const uri = cleanMongoUri(process.env.MONGO_URI)
    if (!uri) {
      throw new Error("Missing MONGO_URI environment variable")
    }

    const fallbackUri =
      cleanMongoUri(process.env.MONGO_URI_FALLBACK) ||
      cleanMongoUri(process.env.MONGO_URI_SRV)

    mongoose.set("strictQuery", true)

    try {
      await connect(uri)
    } catch (error) {
      const canRetryWithFallback =
        fallbackUri &&
        uri.startsWith('mongodb+srv://') &&
        /querySrv|ECONNREFUSED/i.test(error?.message || '')

      if (!canRetryWithFallback) {
        throw error
      }

      console.warn('Primary MongoDB SRV lookup failed, retrying with fallback URI')
      await connect(fallbackUri)
    }

    console.log("MongoDB Connected Successfully")
    
  } catch (error) {
    const message = error?.message || String(error)
    console.error("MongoDB connection failed:", message)

    if (/bad auth|authentication failed/i.test(message)) {
      console.error("Atlas rejected the DB username/password in MONGO_URI.")
      console.error("Fix: Atlas → Database Access → edit user → Edit Password → copy new password into Render MONGO_URI (no quotes).")
      console.error(`Attempted connection: ${maskMongoUri(cleanMongoUri(process.env.MONGO_URI))}`)
    } else if (/ENOTFOUND|querySrv|ECONNREFUSED/i.test(message)) {
      console.error("TIP: Check Atlas cluster hostname and Network Access (allow 0.0.0.0/0 for Render).")
    }

    process.exit(1)
  }
}
