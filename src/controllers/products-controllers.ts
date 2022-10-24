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
    featured: boolean;
}

export const getAllProducts: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({}).exec();
    } catch (err) {
        return next(new HttpError("Failed to fetch product data", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("No product found", 404));
    }

    products.map((product) => product.toObject({ getters: true }));

    res.status(200).json({
        message: "Fetched all products data.",
        products,
    });
};

export const getNewInProducts: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({ newIn: true }).exec();
    } catch (err) {
        return next(new HttpError("Failed to fetch new-in product data", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("No new-in product found", 404));
    }

    products.map((product) => product.toObject({ getters: true }));

    res.status(200).json({
        message: "Fetched all new-in products data.",
        products,
    });
};

export const getFeaturedProducts: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({ featured: true }).exec();
    } catch (err) {
        return next(
            new HttpError("Failed to fetch featured product data", 500)
        );
    }

    if (!products || products.length === 0) {
        return next(new HttpError("No featured product found", 404));
    }

    products.map((product) => product.toObject({ getters: true }));

    res.status(200).json({
        message: "Fetched all featured products data.",
        products,
    });
};

export const createProduct: RequestHandler = async (req, res, next) => {
    const { name, price, images, size, type, newIn, featured } =
        req.body as ProductFactors;

    const createdProduct = new ProductSchema({
        name,
        price,
        images,
        size,
        type,
        newIn,
        featured,
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
