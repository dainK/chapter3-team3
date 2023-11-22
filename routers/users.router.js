import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import {
    signupValidate,
    UserEdit,
    UserDelete,
} from "../middlewares/validator.js";
import {
    ValidError,
    NotUniqueEmail,
    TokenNotExistError,
    NotMatchPassword,
    NotMatchId,
} from "../lib/CustomError.js";
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
        if (!errors.isEmpty()) {
            const err = new ValidError();
            throw err;
        }

        if (existUser || existName) {
            const err = new NotUniqueEmail();
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
userRouter.put("/:id", token_middleware, UserEdit, async (req, res, next) => {
    const errors = validationResult(req);
    const { nickName, password } = req.body;
    const { id } = res.locals.user;
    try {
        if (!errors.isEmpty()) {
            const err = new ValidError();
            throw err;
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
userRouter.delete(
    "/:id",
    token_middleware,
    UserDelete,
    async (req, res, next) => {
        const me = res.locals.user;
        const { id, email } = res.locals.user;
        console.log("userid", id);
        const paramid = Number(req.url.slice(-1));
        console.log("paramid", paramid);
        const { password } = req.body;
        const existUser = await Users.findOne({ where: { email } });

        try {
            if (!me) {
                const err = new TokenNotExistError();
                throw err;
            }
            if (id !== paramid) {
                const err = new NotMatchId();
                throw err;
            }

            const hashedPassword = existUser.password;
            const passwordCheck = await bcrypt.compare(
                password,
                hashedPassword,
            );
            if (!passwordCheck) {
                const err = new NotMatchPassword();
                throw err;
            }

            // await Users.destroy({ where: { id } });
            return res.status(200).json({
                sucess: true,
                message: "회원 탈퇴 성공",
                email: email,
            });
        } catch (err) {
            next(err);
        }
    },
);

// 회원 정보 조회 API
userRouter.get("/:id", token_middleware, (req, res, next) => {
    try {
        const me = res.locals.user;
        console.log("me============>", me);

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
