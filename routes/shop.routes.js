import express from "express";
import isAuth from "../middlewares/isAuth";
import { createEditShop, getMyShop } from "../controllers/shop.controllers";
import { upload } from "../middlewares/multer";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop);
shopRouter.get("get-my", isAuth, getMyShop);

export default shopRouter;
