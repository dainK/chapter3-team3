import { Router } from "express";
import db from "../models/index.js";

import { token_middleware } from "../middlewares/token_middleware.js";

const { Post, Users, Comments, likes } = db; // 수정: Post 모델 가져옴

const postsRouter = Router();

// 게시글 랭크 목록 조회 API
postsRouter.get("/post/main", async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                "id",
                "title",
                "categoryId",
                "createdAt",
                [
                    db.sequelize.literal(
                        "(SELECT COUNT(*) FROM `comments` WHERE `comments`.postId = `Post`.id)",
                    ),
                    "commentsCnt",
                ],
                [
                    db.sequelize.literal(
                        "(SELECT COUNT(*) FROM `likes` WHERE `likes`.postId = `Post`.id)",
                    ),
                    "likesCnt",
                ],
            ],
            order: [["createdAt", "desc"]],
        });

        let totalPosts = [];
        let createdAtPosts = [];
        posts.forEach((e, i) => {
            if (i < 5) {
                createdAtPosts.push(e);
            }

            if (i < 10) {
                totalPosts.push(e);
            }
        });

        let commentPosts = [];
        posts
            .sort((a, b) => b.commentsCnt - a.commentsCnt)
            .forEach((e, i) => {
                if (i < 5) {
                    commentPosts.push(e);
                }
            });

        let likePosts = [];
        posts
            .sort((a, b) => b.likesCnt - a.likesCnt)
            .forEach((e, i) => {
                if (i < 5) {
                    likePosts.push(e);
                }
            });

        return res.status(200).json({
            success: true,
            data: { totalPosts, createdAtPosts, commentPosts, likePosts },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "메인 페이지 정보를 가져오지 못하였습니다.",
        });
    }
});

// 게시글 랭크 목록 조회 API
postsRouter.get("/post/rank", async (req, res) => {
    try {
        const { sort, categoryId } = req.query;
        let orderBy = "";
        let whereCondition = {};

        // 조회조건 sort 에 따라 정렬순서 바뀜, 없으면 기본값 최근글로
        if (!sort) {
            orderBy = "createdAt";
        } else if (sort === "new") {
            orderBy = "createdAt";
        } else if (sort === "comments") {
            orderBy = "commentsCnt";
        } else if (sort === "likes") {
            orderBy = "likesCnt";
        }

        // 조회조건 categoryId 있으면 조회조건 추가
        if (categoryId) {
            whereCondition = { categoryId };
        }

        const posts = await Post.findAll({
            attributes: [
                "id",
                "title",
                "categoryId",
                "createdAt",
                [
                    db.sequelize.literal(
                        "(SELECT COUNT(*) FROM `comments` WHERE `comments`.postId = `Post`.id)",
                    ),
                    "commentsCnt",
                ],
                [
                    db.sequelize.literal(
                        "(SELECT COUNT(*) FROM `likes` WHERE `likes`.postId = `Post`.id)",
                    ),
                    "likesCnt",
                ],
            ],
            where: whereCondition,
            order: [[orderBy, "desc"]],
        });

        return res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "게시글을 찾을 수 없습니다.",
        });
    }
});

// 게시글 생성
postsRouter.post("/post", token_middleware, async (req, res) => {
    try {
        const { id } = res.locals.user;
        const { title, content, categoryId } = req.body;

        // 데이터 유효성 검증
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "게시글의 제목과 내용을 모두 입력해주세요.",
            });
        }

        // 사용자 확인
        const user = await Users.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        // 게시글 생성 및 저장
        const newPost = await Post.create({
            categoryId: categoryId,
            userId: id,
            title: title,
            content: content,
        });

        return res.status(201).json({
            success: true,
            message: "게시글을 성공적으로 등록하였습니다.",
            data: newPost,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "예상치 못한 오류가 발생했습니다. 관리자에게 문의하세요.",
        });
    }
});

// 게시글 목록 조회 API
postsRouter.get("/post", async (req, res) => {
    try {
        const { sort } = req.query;
        let upperCaseSort = sort?.toUpperCase();

        if (upperCaseSort !== "ASC" && upperCaseSort !== "DESC") {
            upperCaseSort = "DESC";
        }

        const posts = await Post.findAll({
            attributes: ["id", "title", "categoryId", "createdAt"],
            order: ["createdAt"],
        });
        // console.log(posts);

        return res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "게시글을 찾을 수 없습니다.",
        });
    }
});

// 특정 유저 게시글 목록 조회 API
postsRouter.get("/user/:userId/post", async (req, res) => {
    try {
        const { userId } = req.params;

        // 사용자 정보 확인
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "사용자의 정보를 찾을 수 없습니다.",
            });
        }

        // 사용자가 작성한 게시물 유무 확인
        const userPosts = await Post.findAll({ where: { userId } });

        // if (userPosts.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "사용자가 작성한 게시물을 찾을 수 없습니다.",
        //     });
        // }

        return res.status(200).json({
            success: true,
            message: "사용자가 작성한 게시물을 성공적으로 가져왔습니다.",
            data: userPosts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "게시물을 찾는 중에 오류가 발생했습니다.",
        });
    }
});

// 게시글 상세 조회 API
postsRouter.get("/post/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({
            attributes: [
                "id",
                "userId",
                "title",
                "categoryId",
                "content",
                "createdAt",
                "updatedAt",
            ],
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당하는 게시물을 찾을 수 없습니다.",
            });
        }

        return res.status(200).json({
            success: true,
            data: post,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "게시물을 찾는 중에 오류가 발생했습니다.",
        });
    }
});

// 게시글 수정
postsRouter.put("/post/:postId", token_middleware, async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "게시글의 제목과 내용을 모두 입력해주세요.",
            });
        }

        const post = await Post.findOne({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당하는 게시물을 찾을 수 없습니다.",
            });
        }

        if (post.userId !== res.locals.user.id) {
            return res.status(403).json({
                success: false,
                message: "게시물을 수정할 권한이 없습니다.",
            });
        }

        await post.update({ title, content });

        return res.status(200).json({
            success: true,
            message: "게시물 정보를 성공적으로 수정하였습니다.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "게시물 정보 수정에 실패하였습니다.",
        });
    }
});

// 게시글 삭제
postsRouter.delete("/post/:postId", token_middleware, async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findOne({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "해당하는 게시물을 찾을 수 없습니다.",
            });
        }

        if (post.userId !== res.locals.user.id) {
            return res.status(403).json({
                success: false,
                message: "게시물을 삭제할 권한이 없습니다.",
            });
        }

        await Post.destroy({ where: { id: postId }, force: true });

        return res.status(200).json({
            success: true,
            message: "게시물 정보를 삭제하였습니다.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "게시물 삭제에 실패하였습니다.",
        });
    }
});

export { postsRouter };
