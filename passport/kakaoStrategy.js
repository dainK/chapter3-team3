import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();
const { Users } = db;

const kakaostrategy = () => {
    passport.use(
        "kakao",
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: `${process.env.CLOUDTYPE_URL}api/auth/kakao/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log("kakao profile", profile);
                try {
                    const exUser = await Users.findOne({
                        where: { email: `kakao${profile._json.id}@kakao.com` },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await Users.create({
                            email: `kakao${profile.id}@kakao.com`,
                            nickName: profile.displayName,
                            imgUrl: profile._json.properties.profile_image,
                            password: profile.id,
                            type: "kakao",
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

export { kakaostrategy };
