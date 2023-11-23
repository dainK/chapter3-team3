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
import { ValidError } from "../lib/CustomError.js";
import { loginValidate } from "../middlewares/validator.js";
import { token_middleware } from "../middlewares/token_middleware.js";
import passport from "passport";

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
            return res.status(401).json({
                success: false,
                errorMessage: "일치하는 회원 정보가 없습니다.",
            });
        }
        const hashedPassword = existUser.password;
        const passwordCheck = await bcrypt.compare(password, hashedPassword);

        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                errorMessage: "비밀번호가 틀렸습니다.",
            });
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

// 카카오 로그인 API
authRouter.get("/kakao", passport.authenticate("kakao"));
authRouter.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/?error=카카오로그인 실패",
    }),
    (req, res) => {
        res.status(200).redirect("/"); // 성공 시에는 /로 이동
    },
);

// 네이버 로그인 API
authRouter.get(
    "/naver",
    passport.authenticate("naver", { authType: "reprompt" }),
);
authRouter.get(
    "/naver/callback",
    passport.authenticate("naver", {
        failureRedirect: "/?error=네이버로그인 실패",
    }),
    (req, res) => {
        res.status(200).redirect("/");
    },
);

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
