import { RequestHandler } from "express";

import HttpError from "../models/http-error";
import OrderSchema from "../models/order-schema";
import UserSchema from "../models/user-schema";

export const createOrder: RequestHandler = async (req, res, next) => {
    const orderId = new Date().getTime().toString();
    const { products, amount, orderInfo, totalAmount, buyer } = req.body;

    let user;
    try {
        user = await UserSchema.find({ _id: buyer }).exec();
    } catch (err: any) {
        return next(new HttpError("使用者資料取得失敗", 500));
    }

    if (!user) {
        return next(new HttpError("使用者不存在，無法建立訂單", 422));
    }

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
        buyer,
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
    const userId = req.params.uid;

    let orders;
    try {
        orders = await OrderSchema.find({ buyer: userId }).exec();
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
    const id = req.params.id;

    let order;
    try {
        order = await OrderSchema.findById(id).exec();
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
