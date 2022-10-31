import { Router } from "express";

import {
    signup,
    login,
    updatePassword,
} from "../controllers/users-controllers";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.patch("/", updatePassword);

export default router;
