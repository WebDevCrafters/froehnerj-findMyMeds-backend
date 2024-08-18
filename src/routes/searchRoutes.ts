import express  from "express"
import asyncHandler from "../middleware/asyncHandler"
import { searchController } from "../controllers/searchController"
import { validateTokenHandler } from "../middleware/validateTokenHandler"

const searchRouter = express.Router()
searchRouter.use(validateTokenHandler);
searchRouter.route("/add").post(asyncHandler(searchController.add));
searchRouter.route("/").get(asyncHandler(searchController.getMySearches));
searchRouter.route("/radius").get(asyncHandler(searchController.getSearchInRedius));

export default searchRouter;