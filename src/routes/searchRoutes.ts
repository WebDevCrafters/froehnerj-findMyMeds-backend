import express  from "express"
import asyncHandler from "../middleware/asyncHandler"
import { searchController } from "../controllers/searchController"
import { validateTokenHandler } from "../middleware/validateTokenHandler"

const searchRouter = express.Router()
searchRouter.use(validateTokenHandler);
searchRouter.route("/add").post(asyncHandler(searchController.add));

export default searchRouter;