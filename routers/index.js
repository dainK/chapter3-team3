import { Router } from "express";
import { userRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";
import { followRouter } from "./follow.router.js";
// 상권님꺼 추가시 넣기
// import { postRouter } from "./post.router.js";
import { likesRouter } from "./likes.router.js";
import passport from "passport";
import { kakaostrategy } from "../passport/kakaoStrategy.js";
import { Naverstrategy } from "../passport/naverStrategy.js";
import { postsRouter } from "./posts.router.js";
import { commentsRouter } from "./comments.router.js";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/user", followRouter);
// 상권님꺼 추가시 넣기
// apiRouter.use("/post", postRouter);
apiRouter.use("/post", likesRouter);
kakaostrategy();
Naverstrategy();
apiRouter.use("/auth", authRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/posts", commentsRouter);

export { apiRouter };
