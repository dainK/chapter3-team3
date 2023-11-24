import { Router } from "express";
import { userRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";
import { followRouter } from "./follow.router.js";
import passport from "passport";
import { kakaostrategy } from "../passport/kakaoStrategy.js";
import { Naverstrategy } from "../passport/naverStrategy.js";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/user", followRouter);
kakaostrategy();
Naverstrategy();
apiRouter.use("/auth", authRouter);

export { apiRouter };
