import mongoose from 'mongoose';
import productModel from './models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("Environment Variables Loaded:", process.env); // Log all environment variables

const connectDB = async () => {
    console.log("MongoDB URL:", process.env.MONGODB_URL); // Log the MongoDB URL
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const checkProducts = async () => {
    try {
        const products = await productModel.find({}, { name: 1, bestSeller: 1 });
        console.log("Products in the database:");
        console.log(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        mongoose.connection.close();
    }
};

const run = async () => {
    await connectDB();
    await checkProducts();
};

run();
