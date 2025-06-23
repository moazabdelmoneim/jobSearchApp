import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log("Error with connecting to DB", err));
};
export default connectDB;
