import { Router } from "express";
import { userRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";
import { followRouter } from "./follow.router.js";
import { likesRouter } from "./likes.router.js";
import passport from "passport";
import { kakaostrategy } from "../passport/kakaoStrategy.js";
import { Naverstrategy } from "../passport/naverStrategy.js";
import { postsRouter } from "./posts.router.js";
import { commentsRouter } from "./comments.router.js";

const apiRouter = Router();

apiRouter.use("/", [userRouter,followRouter,likesRouter,authRouter,postsRouter,commentsRouter]);
kakaostrategy();
Naverstrategy();

export { apiRouter };
