import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { rename } from "fs";

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
    const userId = req.params.userId;
    const { accesstoken } = req.cookies;
    if (accesstoken) {
        const [tokenType, acctoken] = accesstoken.split(" ");
        const decodedAccessToken = jwt.verify(
            acctoken,
            process.env.JWT_TOKENKEY,
        );
        const id = decodedAccessToken.id;
        console.log(id);
        if (!req.cookies.accesstoken) {
            res.render("profile", {
                path,
                userId,
            });
        } else if (req.cookies.accesstoken) {
            res.render("profile", {
                path,
                userId,
                id,
            });
        }
    } else {
        res.render("profile", {
            path,
            userId,
            id: null,
        });
    }
});

viewRouter.get("/post/:postId", function (req, res, next) {
    const { accesstoken } = req.cookies;
    const { postId } = req.params;
    if (accesstoken) {
        const [tokenType, acctoken] = accesstoken.split(" ");
        const decodedAccessToken = jwt.verify(
            acctoken,
            process.env.JWT_TOKENKEY,
        );
        const id = decodedAccessToken.id;
        if (!req.cookies.accesstoken) {
            res.render("post", {
                title: "Post",
                login: "no",
                postId,
                path,
            });
        } else if (req.cookies.accesstoken) {
            res.render("post", {
                title: "Post",
                login: "yes",
                postId,
                path,
                id,
            });
        }
    } else {
        if (!req.cookies.accesstoken) {
            res.render("post", {
                title: "Post",
                login: "no",
                postId,
                path,
                id: null,
            });
        } else if (req.cookies.accesstoken) {
            res.render("post", {
                title: "Post",
                login: "yes",
                postId,
                path,
                id: null,
            });
        }
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
