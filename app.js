import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import cookieParser from "cookie-parser";
import db from "./models/index.js";
import dotenv from "dotenv";
import { apiRouter } from "./routers/index.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";
import morgan from "morgan";
const { Users } = db;
dotenv.config();

const app = express();
const { sequelize } = db;

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findByPk(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});

app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    morgan("dev"),
    cookieParser(),
);

app.use("/api", apiRouter);
app.use(ErrorHandler);

// DB
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((res) => {
        console.log("데이터베이스 연결 실패", res);
    });

app.listen(process.env.PORT, () => {
    console.log("서버 실행");
});

app.get("/", (req, res) => {
    res.send(`ㅎㅇ`);
});
