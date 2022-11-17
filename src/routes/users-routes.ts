import { Router } from "express";

import {
    signup,
    login,
    updatePassword,
    getUserById,
} from "../controllers/users-controllers";
import authCheck from "../middlewares/auth-check";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.use(authCheck);

router.patch("/", updatePassword);

router.get("/:uid", getUserById);

export default router;
