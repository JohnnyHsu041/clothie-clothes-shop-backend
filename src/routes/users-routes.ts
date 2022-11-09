import { Router } from "express";

import {
    signup,
    login,
    updatePassword,
    getUserById,
} from "../controllers/users-controllers";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

// The following routes should be auth verification first
// router.use(userAuthCheck);

router.patch("/", updatePassword);

router.post("/", getUserById);

export default router;
