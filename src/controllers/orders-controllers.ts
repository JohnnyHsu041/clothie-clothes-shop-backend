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
