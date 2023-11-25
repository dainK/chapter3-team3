import { Router } from "express";

const viewRouter = Router();
/* GET home page. */
viewRouter.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
viewRouter.get("/signup", function (req, res, next) {
    res.render("signup", { title: "DAITDA Sign up" });
});
viewRouter.get("/api/auth/login", function (req, res, next) {
    res.render("login", { title: "Login" });
});

export { viewRouter };
