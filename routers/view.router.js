import { Router } from "express";

const viewRouter = Router();

const path = 'http://localhost:3000'; // 다형 수정
/* GET home page. */
viewRouter.get("/", function (req, res, next) {
    if (!req.cookies.accesstoken) {
        res.render("index", {
            title: "DAITDA",
            login: "no",
            path
        });
    } else {
        res.render("index", {
            title: "DAITDA",
            login: "yes",
            path
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
            postId,
            path
        });
    } else {
        res.render("post", {
            title: "Post",
            login: "yes",
            postId,
            path
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
            path
        });
    } else {
        res.render("posting", {
            title: "Post",
            login: "yes",
            path
        });
    }
});
viewRouter.get("/profileEdit", function (req, res, next) {
    res.render("profileEdit");
});

export { viewRouter };
