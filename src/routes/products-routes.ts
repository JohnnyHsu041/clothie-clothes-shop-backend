import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllAccessories,
    getAllProducts,
    getFeaturedProducts,
    getNewInProducts,
    getProductById,
    updateProduct,
} from "../controllers/products-controllers";
import authCheck from "../middlewares/auth-check";

const router = Router();

router.get("/", getAllProducts);

router.get("/newIn", getNewInProducts);

router.get("/featured", getFeaturedProducts);

router.get("/accs", getAllAccessories);

router.get("/:pid", getProductById);

router.use(authCheck);

router.post("/", createProduct);

router.patch("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;
