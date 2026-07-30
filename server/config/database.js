import mongoose from "mongoose";

// Cache connection - connect once and reuse (don’t reconnect every request blindly):
const globalCache = global.mongoose || { conn: null, promise: null };
global.mongoose = globalCache;

export default async function connectDB() {
  if (globalCache.conn) return globalCache.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(process.env.MONGODB_URI);
  }

  globalCache.conn = await globalCache.promise;
  console.log("MongoDB connected");
  return globalCache.conn;
}