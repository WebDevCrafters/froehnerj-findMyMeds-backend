import express  from "express"
import asyncHandler from "../middleware/asyncHandler"
import { searchController } from "../controllers/searchController"
import { validateTokenHandler } from "../middleware/validateTokenHandler"

const searchRouter = express.Router()
searchRouter.use(validateTokenHandler);
searchRouter.route("/add").post(asyncHandler(searchController.add));
searchRouter.route("/").get(asyncHandler(searchController.getMySearches));
searchRouter.route("/:searchId").get(asyncHandler(searchController.getSearch));
searchRouter.route("/radius").get(asyncHandler(searchController.getSearchInRadius));
searchRouter.route("/marked").get(asyncHandler(searchController.getMarkedByMeSearches));
searchRouter.route("/update").post(asyncHandler(searchController.update));
searchRouter.route("/update-status").post(asyncHandler(searchController.markStatus));

export default searchRouter;