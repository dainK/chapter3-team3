import { Router } from "express";
import { userRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";
import passport from "passport";
import { kakaostrategy } from "../passport/kakaoStrategy.js";
import { Naverstrategy } from "../passport/naverStrategy.js";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
kakaostrategy();
Naverstrategy();
apiRouter.use("/auth", authRouter);

export { apiRouter };
