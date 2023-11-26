import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import cookieParser from "cookie-parser";
import db from "./models/index.js";
import dotenv from "dotenv";
import { apiRouter } from "./routers/index.js";
import { viewRouter } from "./routers/view.router.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";
import morgan from "morgan";
import methodOverride from "method-override";
const { Users } = db;
dotenv.config();

const app = express();
const { sequelize } = db;

const __dirname = path.resolve();
// view engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public")));
app.use("/views", express.static(path.join(__dirname, "views")));

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

app.use(methodOverride("_method"));
app.use("/", viewRouter);
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
