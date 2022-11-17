import { RequestHandler } from "express";

import HttpError from "../models/http-error";
import OrderSchema from "../models/order-schema";
import UserSchema from "../models/user-schema";

export const createOrder: RequestHandler = async (req, res, next) => {
    const { products, amount, orderInfo, totalAmount, buyer } = req.body;

    let user;
    try {
        user = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資料取得失敗", 500));
    }

    if (!user || buyer !== req.userData.userId) {
        return next(new HttpError("無使用權限", 401));
    }

    const orderId = new Date().getTime().toString();

    const newOrder = new OrderSchema({
        orderId,
        orderInfo: {
            orderName: orderInfo.orderName,
            email: orderInfo.email,
            contact: orderInfo.contact,
            address: orderInfo.address,
            typeOfDelivery: orderInfo.typeOfDelivery,
        },
        products,
        amount,
        totalAmount,
        buyer: req.userData.userId,
    });

    try {
        await newOrder.save();
    } catch (err: any) {
        return next(new HttpError("訂單建立失敗", 500));
    }

    res.status(201).json({
        message: "訂單建立成功",
        orderId,
    });
};

export const getOrdersByUserId: RequestHandler = async (req, res, next) => {
    let user;
    try {
        user = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資訊取得失敗", 500));
    }

    if (!user) {
        return next(new HttpError("無使用權限", 401));
    }

    let orders;
    try {
        orders = await OrderSchema.find({ buyer: req.userData.userId }).exec();
    } catch (err: any) {
        return next(new HttpError("訂單資訊取得失敗", 500));
    }

    if (!orders) {
        // Error occurs only when getting order data fails
        return next(new HttpError("無下單記錄", 404));
    }

    res.status(200).json({
        message: "取得訂單資訊",
        orders: orders.map((order) => order.toObject({ getters: true })),
    });
};

export const deleteOrder: RequestHandler = async (req, res, next) => {
    let user;
    try {
        user = await UserSchema.findById(req.userData.userId).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資訊取得失敗", 500));
    }

    if (!user) {
        return next(new HttpError("無使用權限", 401));
    }

    const orderId = req.params.oid;

    let order;
    try {
        order = await OrderSchema.findById(orderId).exec();
    } catch (err: any) {
        return next(new HttpError("訂單資訊取得錯誤", 500));
    }

    if (!order) {
        return next(new HttpError("無下單記錄", 404));
    }

    try {
        await order.remove();
    } catch (err: any) {
        return next(new HttpError("訂單更新失敗", 500));
    }

    res.status(200).json({
        message: "刪除成功",
    });
};
