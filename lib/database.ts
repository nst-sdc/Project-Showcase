import mongoose, { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
type Mongoose = typeof mongoose;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend NodeJS global type declaration
declare global {
  var mongooseConnection: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongooseConnection ?? {
  conn: null,
  promise: null
};

global.mongooseConnection = cached;

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
    const opts: ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 1000,
      connectTimeoutMS: 10000,
    };

    console.log('MongoDB URI configured:', MONGODB_URI ? 'Yes' : 'No');
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connection successful!');
      return mongoose;
    }).catch((error) => {
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
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB connection error in dbConnect:', error);
    throw error;
  }
}

export default dbConnect;
