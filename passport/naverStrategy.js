import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver-v2";
import db from "../models/index.js";
const { Users } = db;

const Naverstrategy = () => {
    passport.use(
        "naver",
        new NaverStrategy(
            {
                clientID: process.env.NAVER_ID,
                clientSecret: process.env.NAVER_SECRET,
                callbackURL: "http://localhost:3000/api/auth/naver/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("naver profile : ", profile);
                try {
                    const exUser = await Users.findOne({
                        where: { email: profile.email },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await Users.create({
                            email: profile.email,
                            nickName: profile.nickname,
                            imgUrl: profile.profileImage,
                            password: profile.id,
                            refreshToken: refreshToken,
                            type: "naver",
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};

export { Naverstrategy };
