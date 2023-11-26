import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import { signupValidate, UserDelete } from "../middlewares/validator.js";
import { ValidError, TokenNotExistError } from "../lib/CustomError.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "../constants/security.constant.js";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Post, Likes } = db;

const likesRouter = Router();

// 좋아요 등록/취소 API
likesRouter.put("/post/:id/like", token_middleware, async (req, res, next) => {
    const loginId = res.locals.user.id;
    const postId = parseInt(req.params.id);
    const existPost = await Post.findOne({ where: { id: postId } });
    const existLikes = await Likes.findOne({
        where: {
            userId: loginId,
            postId: postId,
        },
    });
    let resultAct = "";

    try {
        // post 가 없으면 리턴
        if (!existPost) {
            return res.status(400).json({
                success: false,
                errorMessage: "게시글이 존재하지 않습니다.",
            });
        }

        // 기존 좋아요데이터가 있으면 삭제, 없으면 생성
        if (existLikes) {
            resultAct = "취소";
            await Likes.destroy({
                where: {
                    userId: loginId,
                    postId: postId,
                },
            });
        } else {
            resultAct = "등록";
            await Likes.create({
                userId: loginId,
                postId: postId,
            });
        }

        return res.status(200).json({
            success: true,
            message: `좋아요 ${resultAct} 성공`,
        });
    } catch (err) {
        next(err);
    }
});

// 좋아요 목록 조회 API
likesRouter.get("/post/:id/likes", async (req, res, next) => {
    // const loginId = res.locals.user.id;
    const postId = parseInt(req.params.id);
    const { userId } = req.query;
    const existPost = await Post.findOne({ where: { id: postId } });

    try {
        // post 가 없으면 리턴
        if (!existPost) {
            return res.status(400).json({
                success: false,
                errorMessage: "게시글이 존재하지 않습니다.",
            });
        }

        // userId 쿼리가 있으면 해당 유저조건으로 분기
        let whereCondition;
        if (!userId) {
            whereCondition = {
                postId: postId,
            };
        } else {
            whereCondition = {
                postId: postId,
                userId: userId,
            };
        }

        const likesList = await Likes.findAll({
            where: whereCondition,
        });

        return res.status(200).json({
            success: true,
            message: "좋아요 목록 조회 성공",
            data: likesList,
        });
    } catch (err) {
        next(err);
    }
});

export { likesRouter };
