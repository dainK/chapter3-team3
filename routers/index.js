import { Router } from "express";
import { usersRouter } from "./users.router.js";
import { authRouter } from "./auth.router.js";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);

export { apiRouter };
