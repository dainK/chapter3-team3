import { Router } from "express";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {
    JWT_TOKENKEY_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
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
authRouter.post("/auth/login", loginValidate, async (req, res, next) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    console.log(email, password);
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
        // accessToken 생성 함수
        const id = existUser.id;
        function createAccessToken(id) {
            const accessToken = jwt.sign({ id: id }, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
            });
            return accessToken;
        }
        // refreshToken 생성 함수
        function createRefreshToken() {
            const refreshToken = jwt.sign({}, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
            });
            return refreshToken;
        }
        const accessToken = createAccessToken(id);
        const refreshToken = createRefreshToken();

        res.cookie("accesstoken", `Bearer ${accessToken}`);
        res.cookie("refreshtoken", `Refresh ${refreshToken}`);

        await Users.update(
            { refreshToken: refreshToken },
            { where: { email } },
        );
        return res.redirect("/");
    } catch (err) {
        next(err);
    }
});

// 카카오 로그인 API
authRouter.get("/auth/kakao", passport.authenticate("kakao"));
authRouter.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/?error=카카오로그인 실패",
    }),
    async (req, res) => {
        // console.log("리스폰스", req.user.dataValues.id);
        const id = req.user.dataValues.id;
        // accessToken 생성 함수
        function createAccessToken(id) {
            const accessToken = jwt.sign({ id: id }, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
            });
            return accessToken;
        }
        // refreshToken 생성 함수
        function createRefreshToken() {
            const refreshToken = jwt.sign({}, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
            });
            return refreshToken;
        }
        const accessToken = createAccessToken(id);
        const refreshToken = createRefreshToken();

        res.cookie("accesstoken", `Bearer ${accessToken}`);
        res.cookie("refreshtoken", `Refresh ${refreshToken}`);

        await Users.update({ refreshToken: refreshToken }, { where: { id } });
        res.redirect("/");
    },
);

// 네이버 로그인 API
authRouter.get(
    "/auth/naver",
    passport.authenticate("naver", { authType: "reprompt" }),
);
authRouter.get(
    "/auth/naver/callback",
    passport.authenticate("naver", {
        failureRedirect: "/?error=네이버로그인 실패",
    }),
    async (req, res) => {
        // console.log("리스폰스", req.user.dataValues.id);
        const id = req.user.dataValues.id;
        // accessToken 생성 함수
        function createAccessToken(id) {
            const accessToken = jwt.sign({ id: id }, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
            });
            return accessToken;
        }
        // refreshToken 생성 함수
        function createRefreshToken() {
            const refreshToken = jwt.sign({}, JWT_TOKENKEY_SECRET, {
                expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
            });
            return refreshToken;
        }
        const accessToken = createAccessToken(id);
        const refreshToken = createRefreshToken();

        res.cookie("accesstoken", `Bearer ${accessToken}`);
        res.cookie("refreshtoken", `Refresh ${refreshToken}`);

        await Users.update({ refreshToken: refreshToken }, { where: { id } });
        res.status(200).json({
            message: `로그인 성공`,
            accessToken: `${accessToken}`,
            refreshToken: `${refreshToken}`,
        });
    },
);

// 로그아웃
authRouter.get("/auth/logout", token_middleware, (req, res, next) => {
    try {
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

export { authRouter };
