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

        // 게시물 확인
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당 게시물을 찾을 수 없습니다.",
            });
        }

        // 또 오류나면 먼저 확인해볼 곳(토큰에서 가져온 유저 ID)
        const userId = res.locals.user.id;

        // 댓글 생성
        const newComment = await Comments.create({
            postId: postId,
            userId: userId, // 다음 확인해볼 곳(위에서 가져온 유저 ID)
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

// 댓글 가져오기
commentsRouter.get("/:postId/comments", token_middleware, async (req, res) => {
    try {
        const { postId } = req.params;

        // 게시물 확인
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당 게시물을 찾을 수 없습니다.",
            });
        }

        // 해당 게시물 댓글 가져오기
        const comments = await Comments.findAll({
            where: { postId },
        });

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "작성되어 있는 댓글이 없습니다.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "댓글을 성공적으로 가져왔습니다.",
            data: comments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "댓글을 가져오는 중에 오류가 발생했습니다.",
        });
    }
});

// 댓글 수정
commentsRouter.put(
    "/:postId/comments/:commentId",
    token_middleware,
    async (req, res) => {
        try {
            const { postId, commentId } = req.params;
            const { comment } = req.body;

            // 게시물 확인
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "해당 게시물을 찾을 수 없습니다.",
                });
            }

            // 댓글 확인
            const existingComment = await Comments.findOne({
                where: { id: commentId, postId: postId },
            });
            if (!existingComment) {
                return res.status(404).json({
                    success: false,
                    message: "해당 댓글을 찾을 수 없습니다.",
                });
            }

            // 사용자 확인
            const userId = res.locals.user.id;
            if (existingComment.userId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "댓글을 수정할 권한이 없습니다.",
                });
            }

            // 댓글 내용 확인
            if (!comment || comment.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "댓글 내용을 제대로 입력해주세요.",
                });
            }

            // 댓글 수정 확인
            await existingComment.update({ comment: comment });

            return res.status(200).json({
                success: true,
                message: "댓글이 성공적으로 수정되었습니다.",
                data: existingComment,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "댓글 수정 중에 오류가 발생했습니다.",
            });
        }
    },
);

export { commentsRouter };
