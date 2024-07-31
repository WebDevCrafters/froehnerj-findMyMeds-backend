import mongoose, { Mongoose } from "mongoose";

const connectToDB = async (): Promise<void> => {
    try {
        const connect: Mongoose = await mongoose.connect(
            process.env.CONNECTION_STRING as string
        );
        console.log("Database Connected");
        console.log(connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
    }
};

 export default connectToDB;
