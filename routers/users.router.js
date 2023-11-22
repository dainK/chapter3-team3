import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import { signupValidate } from "../middlewares/validator.js";
import { ValidError, NotUniqueEmail } from "../lib/CustomError.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "../constants/security.constant.js";

const { Users } = db;

const usersRouter = Router();

// 회원가입 API
usersRouter.post("/signup", signupValidate, async (req, res, next) => {
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

export { usersRouter };
