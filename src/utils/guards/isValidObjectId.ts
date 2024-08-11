import mongoose from "mongoose";

function isValidObjectId(id: any): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

export default isValidObjectId;
