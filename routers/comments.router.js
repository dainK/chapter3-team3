import { Router } from "express";
import db from "../models/index.js";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Comments, Users, Post } = db;

const commentsRouter = Router();

// 댓글 생성
commentsRouter.post("/:postId/comments", token_middleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;

        // 게시물 존재 여부 확인
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당 게시물을 찾을 수 없습니다.",
            });
        }

        // 여기서부터 수정
        const userId = res.locals.user.id; // 토큰에서 가져온 유저 ID

        // 댓글 생성
        const newComment = await Comments.create({
            postId: postId,
            userId: userId, // 위에서 가져온 유저 ID 사용
            comment: comment,
        });

        return res.status(201).json({
            success: true,
            message: "댓글이 성공적으로 생성되었습니다.",
            data: newComment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "댓글 생성 중에 오류가 발생했습니다.",
        });
    }
});

export { commentsRouter };
