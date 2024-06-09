import mongoose from 'mongoose';

const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.APP_ENV === 'production'
        ? process.env.MONGODB_PROD_URI
        : process.env.MONGODB_URI,
      {
        dbName: 'mime_api',
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit();
  }
};

export default dbconnect;
