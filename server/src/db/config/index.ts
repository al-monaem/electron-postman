import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "post_ssl",
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit();
  }
};

export default dbconnect;
