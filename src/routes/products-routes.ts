import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
} from "../controllers/products-controllers";

const router = Router();

router.get("/", getAllProducts);

router.post("/", createProduct);

router.delete("/:pid", deleteProduct);

export default router;
