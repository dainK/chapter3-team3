import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import {
    signupValidate,
    UserEdit,
    UserDelete,
} from "../middlewares/validator.js";
import { ValidError, TokenNotExistError } from "../lib/CustomError.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "../constants/security.constant.js";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Users } = db;

const userRouter = Router();

// 회원가입 API
userRouter.post("/signup", signupValidate, async (req, res, next) => {
    const errors = validationResult(req);
    const { email, nickName, password } = req.body;
    const existUser = await Users.findOne({ where: { email } });
    const existName = await Users.findOne({ where: { nickName } });

    try {
        if (existUser || existName) {
            return res.status(412).json({
                success: false,
                errorMessage: "이메일 또는 닉네임이 이미 사용 중 입니다.",
            });
        }
        if (!errors.isEmpty()) {
            const err = new ValidError();
            throw err;
        }

        const hashedPassword = bcrypt.hashSync(
            password,
            PASSWORD_HASH_SALT_ROUNDS,
        );

        const newUser = await Users.create({
            email,
            password: hashedPassword,
            nickName,
        });

        return res.status(201).json({
            sucess: true,
            message: "회원가입 성공",
            data: newUser,
        });
    } catch (err) {
        next(err);
    }
});

// 회원 정보 수정 API
userRouter.put("", token_middleware, UserEdit, async (req, res, next) => {
    const errors = validationResult(req);
    const { nickName, password } = req.body;
    const { id } = res.locals.user;
    const existUser = await Users.findOne({ where: { id } });
    const existName = await Users.findOne({ where: { nickName } });
    try {
        if (existName) {
            return res.status(412).json({
                success: false,
                errorMessage: "닉네임이 이미 사용 중 입니다.",
            });
        }
        if (!errors.isEmpty()) {
            const err = new ValidError();
            throw err;
        }
        const hashPassword = existUser.password;
        const passwordCheck = await bcrypt.compare(password, hashPassword);
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                errorMessage: "비밀번호가 틀렸습니다.",
            });
        }

        const hashedPassword = bcrypt.hashSync(
            password,
            PASSWORD_HASH_SALT_ROUNDS,
        );

        const editUser = await Users.update(
            {
                nickName,
                password: hashedPassword,
            },
            {
                where: { id },
            },
        );

        return res.status(200).json({
            sucess: true,
            message: "회원 정보 수정 성공",
            data: editUser,
        });
    } catch (err) {
        next(err);
    }
});

// 회원 탈퇴 API
userRouter.delete("", token_middleware, UserDelete, async (req, res, next) => {
    const me = res.locals.user;
    const { id, email } = res.locals.user;
    const { password } = req.body;
    const existUser = await Users.findOne({ where: { email } });

    try {
        if (!me) {
            const err = new TokenNotExistError();
            throw err;
        }

        const hashedPassword = existUser.password;
        const passwordCheck = await bcrypt.compare(password, hashedPassword);
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                errorMessage: "비밀번호가 틀렸습니다.",
            });
        }

        await Users.destroy({ where: { id }, force: true });
        return res.status(200).json({
            sucess: true,
            email: email,
            message: "회원 탈퇴 성공",
        });
    } catch (err) {
        next(err);
    }
});

// 회원 정보 조회 API
userRouter.get("", token_middleware, (req, res, next) => {
    try {
        const me = res.locals.user;

        if (!me) {
            const err = new TokenNotExistError();
            throw err;
        }
        return res.status(200).json({
            sucess: true,
            message: "내 정보 조회 성공!",
            data: me,
        });
    } catch (err) {
        next(err);
    }
});
export { userRouter };
