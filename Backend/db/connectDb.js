import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URL);
    console.log("Db connection established : " + db.connection.host);
  } catch (error) {
    console.log("Error" + error.message);
    process.exit(1);
  }
};
