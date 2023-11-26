import { Router } from "express";

const viewRouter = Router();
/* GET home page. */
viewRouter.get("/", function (req, res, next) {
    if (!req.cookies.accesstoken) {
        res.render("index", {
            title: "DAITDA",
            login: "no",
        });
    } else {
        res.render("index", {
            title: "DAITDA",
            login: "yes",
        });
    }
});
viewRouter.get("/signup", function (req, res, next) {
    res.render("signup", { title: "DAITDA Sign up" });
});
viewRouter.get("/login", function (req, res, next) {
    res.render("login", { title: "Login" });
});
viewRouter.get("/user/mypage", function (req, res, next) {
    res.render("profile", { title: "My page" });
});
viewRouter.get("/post/:postId", function (req, res, next) {
    const { postId } = req.params;
    if (!req.cookies.accesstoken) {
        res.render("post", {
            title: "Post",
            login: "no",
            postId
        });
    } else {
        res.render("post", {
            title: "Post",
            login: "yes",
            postId
        });
    }
});
viewRouter.get("/user/withdrawal", function (req, res, next) {
    res.render("withdrawal", { title: "회원 탈퇴" });
});
viewRouter.get("/posting", function (req, res, next) {
    if (!req.cookies.accesstoken) {
        res.render("posting", {
            title: "Post",
            login: "no",
        });
    } else {
        res.render("posting", {
            title: "Post",
            login: "yes",
        });
    }
});

export { viewRouter };
