import { Router } from "express";
import {
    createProduct,
    deleteProduct,
} from "../controllers/products-controllers";

const router = Router();

router.post("/", createProduct);

router.delete("/:pid", deleteProduct);

export default router;
