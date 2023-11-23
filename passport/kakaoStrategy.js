import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import db from "../models/index.js";
const { Users } = db;

const kakaostrategy = () => {
    passport.use(
        "kakao",
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: "http://localhost:3000/api/auth/kakao/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("kakao profile", profile);
                console.log("========> 여기까진 성공");
                try {
                    const exUser = await Users.findOne({
                        where: { email: `kakao${profile._json.id}@kakao.com` },
                    });
                    if (exUser) {
                        console.log("가입 이력 있음", accessToken);
                        done(null, exUser);
                    } else {
                        const newUser = await Users.create({
                            email: `kakao${profile.id}@kakao.com`,
                            nickName: profile.displayName,
                            imgUrl: profile._json.properties.profile_image,
                            password: profile.id,
                        });
                        console.log("가입이력 없음", accessToken);
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
