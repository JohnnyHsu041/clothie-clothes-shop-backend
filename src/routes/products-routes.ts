import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getNewInProducts,
} from "../controllers/products-controllers";

const router = Router();

router.get("/", getAllProducts);

router.get("/newIn", getNewInProducts);

router.get("/featured", getFeaturedProducts);

router.post("/", createProduct);

router.delete("/:pid", deleteProduct);

export default router;
