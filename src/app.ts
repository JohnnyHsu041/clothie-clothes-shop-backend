import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Mongoose from "mongoose";

import HttpError from "./models/http-error";

const app = express();

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
    return next(new HttpError("Could not find the route.", 404));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.code || 500).json({
        message: err.message || "An unknown error occurred.",
    });
});

Mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ezakmlr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
)
    .then(() => {
        app.listen(process.env.PORT);
        console.log("Connected to the database.");
    })
    .catch((err) => console.log(err));
