import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-showcase';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached: MongooseConnection = global.mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // If we have an existing connection, check if it's still valid
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return cached.conn;
    } else {
      console.log('Existing connection is broken, reconnecting...');
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of default 30
      heartbeatFrequencyMS: 1000,     // Check connection more frequently 
    };

    console.log('MongoDB URI configured:', MONGODB_URI ? 'Yes' : 'No');
    console.log('Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connection successful!');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        
        // Handle auth errors specifically
        if (error.message && error.message.includes('bad auth')) {
          throw new Error('MongoDB authentication failed. Please check your username and password in the MONGODB_URI');
        }
        
        // Re-throw the original error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB connection error in dbConnect:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
