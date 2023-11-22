import { Router } from "express";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {
    JWT_TOKENKEY_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
} from "../constants/security.constant.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import {
    NotExistUserError,
    NotMatchPassword,
    ValidError,
} from "../lib/CustomError.js";
import { loginValidate } from "../middlewares/validator.js";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Users } = db;

const authRouter = Router();
// 로그인 API
authRouter.post("/login", loginValidate, async (req, res, next) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    const existUser = await Users.findOne({ where: { email } });

    try {
        if (!errors.isEmpty()) {
            const err = new ValidError();
            throw err;
        }
        if (!existUser) {
            const err = new NotExistUserError();
            throw err;
        }
        const hashedPassword = existUser.password;
        const passwordCheck = await bcrypt.compare(password, hashedPassword);
        if (!passwordCheck) {
            const err = new NotMatchPassword();
            throw err;
        }
        const accessToken = jwt.sign(
            { id: existUser.id },
            JWT_TOKENKEY_SECRET,
            {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
            },
        );
        res.cookie("authorization", `Bearer ${accessToken}`);
        return res.status(200).json({
            success: true,
            message: "로그인 성공.",
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
});

// 로그아웃
authRouter.get("/logout", token_middleware, (req, res, next) => {
    try {
        res.clearCookie("authorization");
        res.status(200).json({ success: true, message: "로그아웃 성공" });
    } catch (err) {
        next(err);
    }
});

export { authRouter };
