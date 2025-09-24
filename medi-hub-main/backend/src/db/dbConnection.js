import mongoose from "mongoose";
// import { DB_NAME } from "../../constants.js";

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug line
const connectDB = async () => {
    try {
        console.log('Attempting to connect to:', process.env.MONGODB_URI); // Debug line
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB