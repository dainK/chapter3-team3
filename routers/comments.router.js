import express from "express";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Comments, Users, Post, likes } = db;

const commentsRouter = express.Router();

// 댓글 생성
commentsRouter.post;

// 댓글 가져오기
commentsRouter.get;

// 댓글 수정
commentsRouter.put;

// 댓글 삭제
commentsRouter.delete;

export { commentsRouter };
