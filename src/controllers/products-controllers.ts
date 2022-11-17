import { RequestHandler } from "express";

import HttpError from "../models/http-error";
import ProductSchema from "../models/product-schema";
import UserSchema from "../models/user-schema";

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
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("商品不存在", 404));
    }

    res.status(200).json({
        message: "取得所有商品資訊",
        products: products.map((product) =>
            product.toObject({ getters: true })
        ),
    });
};

export const getNewInProducts: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({ newIn: true }).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("商品不存在", 404));
    }

    res.status(200).json({
        message: "取得最新商品資訊",
        products: products.map((product) =>
            product.toObject({ getters: true })
        ),
    });
};

export const getFeaturedProducts: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({ featured: true }).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("商品不存在", 404));
    }

    res.status(200).json({
        message: "取得主打商品資訊",
        products: products.map((product) =>
            product.toObject({ getters: true })
        ),
    });
};

export const getAllAccessories: RequestHandler = async (req, res, next) => {
    let products;

    try {
        products = await ProductSchema.find({ type: "accs" }).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError("商品不存在", 404));
    }

    res.status(200).json({
        message: "取得飾品資訊",
        products: products.map((product) =>
            product.toObject({ getters: true })
        ),
    });
};

export const getProductById: RequestHandler = async (req, res, next) => {
    const productId = req.params.pid;
    let product;

    try {
        product = await ProductSchema.find({ _id: productId }).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!product || product.length === 0) {
        return next(new HttpError("商品不存在", 404));
    }

    res.status(200).json({
        message: "取得特定商品資訊",
        product: product.map((product) => product.toObject({ getters: true })),
    });
};

export const createProduct: RequestHandler = async (req, res, next) => {
    let existingUser;
    try {
        existingUser = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資訊取得失敗", 500));
    }

    if (!existingUser || !existingUser.isAdmin) {
        return next(new HttpError("無使用權限", 401));
    }

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
        return next(new HttpError("產品建立失敗", 500));
    }

    res.status(201).json({
        message: "產品建立成功",
        product: createdProduct.toObject({ getters: true }),
    });
};

export const updateProduct: RequestHandler = async (req, res, next) => {
    let existingUser;
    try {
        existingUser = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資訊取得失敗", 500));
    }

    if (!existingUser || !existingUser.isAdmin) {
        return next(new HttpError("無使用權限", 401));
    }

    const productId = req.params.pid;

    const { name: updatedName, price: updatedPrice } = req.body;

    let product;
    try {
        product = await ProductSchema.findById(productId).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!product) {
        return next(new HttpError("商品不存在", 404));
    }

    product.name = updatedName;
    product.price = updatedPrice;

    try {
        await product.save();
    } catch (err) {
        return next(new HttpError("更新失敗", 500));
    }

    res.status(200).json({
        message: "更新成功",
        product: product.toObject({ getters: true }),
    });
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
    let existingUser;
    try {
        existingUser = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資訊取得失敗", 500));
    }

    if (!existingUser || !existingUser.isAdmin) {
        return next(new HttpError("無使用權限", 401));
    }

    const productId = req.params.pid;

    let product;
    try {
        product = await ProductSchema.findById(productId).exec();
    } catch (err) {
        return next(new HttpError("商品資訊取得失敗，請再試一次", 500));
    }

    if (!product) {
        return next(new HttpError("商品不存在", 404));
    }

    try {
        await product.remove();
    } catch (err) {
        return next(new HttpError("刪除失敗", 500));
    }

    res.status(200).json({
        message: "刪除成功",
    });
};
