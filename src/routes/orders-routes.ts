import { Router } from "express";
import {
    createOrder,
    deleteOrder,
    getOrdersByUserId,
} from "../controllers/orders-controllers";

const router = Router();

// The following routes should be auth verification first
// router.use(userAuthCheck);

router.post("/", createOrder);

router.get("/:uid", getOrdersByUserId);

router.delete("/:id", deleteOrder);

export default router;
