import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const viewRouter = Router();

const path = process.env.CLOUDTYPE_URL;
/* GET home page. */
viewRouter.get("/", function (req, res, next) {
    if (!req.cookies.accesstoken) {
        res.render("index", {
            title: "DAITDA",
            login: "no",
            path,
        });
    } else {
        res.render("index", {
            title: "DAITDA",
            login: "yes",
            path,
        });
    }
});
viewRouter.get("/signup", function (req, res, next) {
    res.render("signup", { title: "DAITDA Sign up", path });
});
viewRouter.get("/login", function (req, res, next) {
    res.render("login", { title: "Login", path });
});
viewRouter.get("/user/:userId", function (req, res, next) {
    const { userId } = req.params;
    res.render("profile", { title: "My page", path, userId });
});
viewRouter.get("/post/:postId", function (req, res, next) {
    const { postId } = req.params;
    if (!req.cookies.accesstoken) {
        res.render("post", {
            title: "Post",
            login: "no",
            postId,
            path,
        });
    } else {
        res.render("post", {
            title: "Post",
            login: "yes",
            postId,
            path,
        });
    }
});
viewRouter.get("/user/withdrawal", function (req, res, next) {
    res.render("withdrawal", { title: "회원 탈퇴", path });
});
viewRouter.get("/posting", function (req, res, next) {
    if (!req.cookies.accesstoken) {
        res.render("posting", {
            title: "Post",
            login: "no",
            path,
        });
    } else {
        res.render("posting", {
            title: "Post",
            login: "yes",
            path,
        });
    }
});
viewRouter.get("/postedit", function (req, res, next) {
    const { postId } = req.params;
    if (!req.cookies.accesstoken) {
        res.render("postedit", {
            title: "Post",
            login: "no",
            path,
            postId,
        });
    } else {
        res.render("postedit", {
            title: "Post",
            login: "yes",
            path,
            postId,
        });
    }
});
viewRouter.get("/profileEdit", function (req, res, next) {
    res.render("profileEdit", { path });
});

export { viewRouter };
