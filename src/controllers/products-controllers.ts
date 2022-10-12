import { RequestHandler } from "express";
import HttpError from "../models/http-error";
import ProductSchema from "../models/product-schema";

interface ProductFactors {
    name: string;
    price: number;
    images: string[];
    size: string;
    type: string;
    newIn: boolean;
}

export const createProduct: RequestHandler = async (req, res, next) => {
    const { name, price, images, size, type, newIn } =
        req.body as ProductFactors;

    const createdProduct = new ProductSchema({
        name,
        price,
        images,
        size,
        type,
        newIn,
    });

    try {
        await createdProduct.save();
    } catch (err) {
        return next(new HttpError("Failed to create the product", 500));
    }

    res.status(201).json({
        message: "created the product.",
        product: createdProduct.toObject({ getters: true }),
    });
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.pid;

    let product;
    try {
        product = await ProductSchema.findById(productId).exec();
    } catch (err) {
        return next(new HttpError("Failed to fetch the product data.", 500));
    }

    if (!product) {
        return next(new HttpError("Product does not exist.", 404));
    }

    try {
        await product.remove();
    } catch (err) {
        return next(new HttpError("Failed to delete the product.", 500));
    }

    res.status(200).json({
        message: "Deleted the product.",
    });
};
