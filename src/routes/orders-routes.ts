import { Router } from "express";
import {
    createOrder,
    deleteOrder,
    getOrdersByUserId,
} from "../controllers/orders-controllers";
import authCheck from "../middlewares/auth-check";

const router = Router();

router.use(authCheck);

router.post("/", createOrder);

router.get("/", getOrdersByUserId);

router.delete("/:oid", deleteOrder);

export default router;
