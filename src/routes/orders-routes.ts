import { Router } from "express";
import { createOrder } from "../controllers/orders-controllers";

const router = Router();

// The following routes should be auth verification first
// router.use(userAuthCheck);

router.post("/", createOrder);

export default router;
