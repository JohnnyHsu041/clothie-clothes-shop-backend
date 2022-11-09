import * as dotenv from "dotenv";
dotenv.config();

import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import HttpError from "../models/http-error";
import UserSchema from "../models/user-schema";

export const signup: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await UserSchema.findOne({ email }).exec();
    } catch (err: any) {
        return next(new HttpError("註冊失敗，請再試一次", 500));
    }

    if (existingUser) {
        return next(new HttpError("此電子郵件已註冊，請登入", 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError("註冊發生錯誤，請再試一次", 500));
    }

    const newUser = new UserSchema({
        email,
        password: hashedPassword,
        isAdmin: false,
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new HttpError("伺服器錯誤，請再試一次", 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.TOKEN_PRIVATE_KEY as string,
            { expiresIn: "2h" }
        );
    } catch (err: any) {
        return next(new HttpError("token產生失敗", 500));
    }

    res.status(201).json({
        message: "註冊成功",
        userId: newUser.id,
        token,
    });
};

export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await UserSchema.findOne({ email }).exec();
    } catch (err) {
        return next(new HttpError("登入失敗，請再試一次", 500));
    }

    if (!existingUser) {
        return next(new HttpError("帳號不存在，請註冊帳號", 422));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError("登入發生錯誤，請再試一次", 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("帳號或密碼錯誤，請再試一次", 401));
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
            },
            process.env.TOKEN_PRIVATE_KEY as string,
            { expiresIn: "2h" }
        );
    } catch (err: any) {
        return next(new HttpError("token產生失敗", 500));
    }

    res.status(200).json({
        message: "登入成功",
        userId: existingUser.id,
        token,
    });
};

export const updatePassword: RequestHandler = async (req, res, next) => {
    const { email, oldPassword, updatedPassword } = req.body;

    if (oldPassword === updatedPassword) {
        return next(new HttpError("新密碼不可與舊密碼相同，請重新輸入", 422));
    }

    let existingUser;
    try {
        existingUser = await UserSchema.findOne({ email }).exec();
    } catch (err) {
        return next(new HttpError("伺服器發生錯誤，請再試一次", 500));
    }

    if (!existingUser) {
        return next(new HttpError("使用者不存在", 422));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(
            oldPassword,
            existingUser.password
        );
    } catch (err) {
        return next(new HttpError("密碼比對發生錯誤，請再試一次", 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("舊密碼輸入錯誤", 401));
    }

    let hashedNewPassword;
    try {
        hashedNewPassword = await bcrypt.hash(updatedPassword, 12);
    } catch (err) {
        return next(new HttpError("密碼更新失敗，請再試一次", 500));
    }

    existingUser.password = hashedNewPassword;

    try {
        await existingUser.save();
    } catch (err) {
        return next(new HttpError("更新失敗，伺服器發生錯誤，請再試一次", 500));
    }

    res.status(200).json({
        message: "密碼更新成功，請重新登入",
    });
};

export const getUserById: RequestHandler = async (req, res, next) => {
    const { userId } = req.body;

    let existingUser;
    try {
        existingUser = await UserSchema.findOne(
            { _id: userId },
            "email"
        ).exec();
    } catch (err: any) {
        return next(
            new HttpError("取得電子郵件資訊時發生錯誤，請再試一次", 500)
        );
    }

    if (!existingUser) {
        return next(new HttpError("使用者不存在", 422));
    }

    res.status(200).json({
        message: "電子郵件取得成功",
        email: existingUser.email,
    });
};
