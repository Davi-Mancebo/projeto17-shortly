import express from "express";
import cors from "cors";
import * as user from "../controllers/userController.js";
import * as link from "../controllers/linksController.js"
import auth from "../middleware/authenticationValidator.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

router.post("/signup", user.signUp);
router.post("/signin", user.signIn);

router.get("/urls/:id", link.getUrlById);
router.get("/urls/open/:shortUrl", link.addVisit);
router.get("/ranking", link.getUrls);


router.use(auth)
router.post("/urls/shorten", link.shortUrl);
router.get("/users/me", user.getMe);
router.delete("/urls/:id", link.deleteById);



export default router;
