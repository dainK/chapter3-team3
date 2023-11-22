import { Router } from "express";
import { userRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);

export { apiRouter };
