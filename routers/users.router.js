import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import {
    signupValidate,
    UserEditNick,
    UserEditPWD,
    UserDelete,
} from "../middlewares/validator.js";
import { ValidError, TokenNotExistError } from "../lib/CustomError.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "../constants/security.constant.js";
import { token_middleware } from "../middlewares/token_middleware.js";
import uploadImage from "../middlewares/upload_middleware.js";
import s3 from "../config/s3.config.js";
import jwt from "jsonwebtoken";
import {
    JWT_TOKENKEY_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
} from "../constants/security.constant.js";

const { Users } = db;

const userRouter = Router();

// 회원가입 API
userRouter.post("/user/signup", signupValidate, async (req, res, next) => {
    const errors = validationResult(req);
    const { email, nickName, password } = req.body;
    const existUser = await Users.findOne({ where: { email } });
    const existName = await Users.findOne({ where: { nickName } });

    try {
        if (existUser) {
            return res.status(412).json({
                success: false,
                errorMessage: "이메일이 이미 사용 중 입니다.",
            });
        }
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

        const hashedPassword = bcrypt.hashSync(
            password,
            PASSWORD_HASH_SALT_ROUNDS,
        );

        const newUser = await Users.create({
            email,
            password: hashedPassword,
            nickName,
        });

        // 회원가입 버튼 클릭 후 자동 로그인
        const existUsers = await Users.findOne({ where: { email } });
        const existNames = await Users.findOne({ where: { nickName } });
        // accessToken 생성 함수
        const id = existUsers.id;
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
        return res
            .status(200)
            .json({ success: true, message: "회원가입 성공" });
    } catch (err) {
        next(err);
    }
});

// 회원 정보 수정 비밀번호 API
userRouter.put(
    "/user/password",
    UserEditPWD,
    token_middleware,
    async (req, res, next) => {
        const errors = validationResult(req);
        const { password, passwordConfirm } = req.body;
        const { id } = res.locals.user;

        try {
            if (!errors.isEmpty()) {
                const err = new ValidError();
                throw err;
            }

            if (password !== passwordConfirm) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "비밀번호와 비밀번호 확인이 서로 다릅니다.",
                });
            }

            const hashedPassword = bcrypt.hashSync(
                password,
                PASSWORD_HASH_SALT_ROUNDS,
            );

            const editUser = await Users.update(
                {
                    password: hashedPassword,
                },
                {
                    where: { id },
                },
            );

            return res.status(200).json({
                success: true,
                message: "비밀번호 변경 성공",
                // data: editUser,
            });
        } catch (err) {
            next(err);
        }
    },
);
// 회원 정보 수정 닉네임 API
userRouter.put(
    "/user/nickname",
    token_middleware,
    UserEditNick,
    async (req, res, next) => {
        const errors = validationResult(req);
        const { nickName } = req.body;
        const { id } = res.locals.user;
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

            const editUser = await Users.update(
                {
                    nickName,
                },
                {
                    where: { id },
                },
            );

            return res.status(200).json({
                success: true,
                message: "닉네임 변경 성공",
                data: editUser,
            });
        } catch (err) {
            next(err);
        }
    },
);

// 회원 정보 이미지 수정 API
userRouter.put(
    "/user/image",
    token_middleware,
    uploadImage.single("imgUrl"),
    async (req, res, next) => {
        const { id } = res.locals.user;
        let imgUrl = res.locals.user.imgUrl;
        console.log(imgUrl);
        try {
            if (req.file) {
                // if (imgUrl) {
                //     // // 기존 이미지가 있는 경우, S3에서 삭제
                //     // if (imgUrl !== "userprofile/null.png") {
                //     //     //const oldImageKey = imgUrl; // S3 key 추출
                //     //     // const oldImageKey = imgUrl.split("/").pop(); // S3 key 추출
                //     //     await s3
                //     //         .deleteObject({
                //     //             Bucket: process.env.S3_BUCKET,
                //     //             Key: imgUrl,
                //     //         })
                //     //         .promise();
                //     // }
                // }
                imgUrl = req.file.location; // 새 S3 URL
                // console.log(imgUrl);
                // console.log(req.file);
            }
            // console.log(imgUrl);

            const editUser = await Users.update(
                {
                    imgUrl,
                },
                {
                    where: { id },
                },
            );
            return res.status(200).json({
                success: true,
                message: "프로필사진 변경 성공",
                data: editUser,
            });
        } catch (error) {
            next(error);
        }
    },
);

// 회원 탈퇴 API
userRouter.delete(
    "/user",
    token_middleware,
    UserDelete,
    async (req, res, next) => {
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
            const passwordCheck = await bcrypt.compare(
                password,
                hashedPassword,
            );
            if (!passwordCheck) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "비밀번호가 틀렸습니다.",
                });
            }

            await Users.destroy({ where: { id }, force: true });
            res.clearCookie("accesstoken");
            res.clearCookie("refreshtoken");
            return res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
);

//회원 정보 조회 API
userRouter.get("/user/me", token_middleware, (req, res, next) => {
    try {
        const me = res.locals.user;

        if (!me) {
            const err = new TokenNotExistError();
            throw err;
        }
        return res.status(200).json({
            success: true,
            message: "내 정보 조회 성공!",
            data: me,
        });
    } catch (err) {
        next(err);
    }
});

// 회원 정보 조회 API
userRouter.get("/user/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await Users.findOne({
            attributes: {
                include: [
                    [
                        db.sequelize.literal(
                            "(SELECT COUNT(*) FROM `follow` WHERE `follow`.followrId = `Users`.id)",
                        ),
                        "followerCnt",
                    ],
                    [
                        db.sequelize.literal(
                            "(SELECT COUNT(*) FROM `follow` WHERE `follow`.followedId = `Users`.id)",
                        ),
                        "followedCnt",
                    ],
                ],
            },
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "회원 정보 조회 성공!",
            data: user,
        });
    } catch (err) {
        next(err);
    }
});

// userRouter.post("/upload",uploadImage.single("imgUrl"),(req,res)=>{
//     return res.status(200).json({
//         success: true,
//         message: "업로드 성공!",
//     });
// })

export { userRouter };
