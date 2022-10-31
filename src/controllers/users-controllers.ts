import * as dotenv from "dotenv";
dotenv.config();

import { RequestHandler } from "express";
import bcrypt from "bcryptjs";

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
        return next(new HttpError("帳號已註冊，請登入帳號", 422));
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

    res.status(201).json({
        message: "註冊成功",
        userId: newUser.id,
        email: newUser.email,
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

    res.status(200).json({
        message: "登入成功",
        userId: existingUser.id,
        email: existingUser.email,
    });
};

export const updatePassword: RequestHandler = async (req, res, next) => {
    const { email, password, updatedPassword } = req.body;

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
        isValidPassword = await bcrypt.compare(password, existingUser.password);
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
