import express from "express";
import cors from "cors";
import * as user from "../controllers/userController.js";
import * as link from "../controllers/linksController.js"

const router = express.Router();
router.use(cors());
router.use(express.json());

router.post("/signup", user.signUp);
router.post("/signin", user.signIn);
router.post("/urls/shorten", link.shortUrl);

router.get("/urls/:id", link.getUrlById);
router.get("/urls/open/:shortUrl", link.addVisit);
router.get("/users/me",);
router.get("/ranking",);

router.delete("/urls/:id");

export default router;
