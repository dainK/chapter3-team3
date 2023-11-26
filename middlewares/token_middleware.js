import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {
    TokenNotExistError,
    TokenTypeUnMatch,
    UserNotExistError,
} from "../lib/CustomError.js";
import {
    JWT_TOKENKEY_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
} from "../constants/security.constant.js";
const { Users } = db;

const token_middleware = async (req, res, next) => {
    const { accesstoken, refreshtoken } = req.cookies;
    if (!accesstoken)
        return res.status(400).json({
            success: false,
            errorMessage: "로그인 후 이용 가능합니다.",
        });
    const [tokenType, acctoken] = accesstoken.split(" ");
    const [tokenTYPE, reftoken] = refreshtoken.split(" ");

    // 쿠키 유효성 검증
    const isRefreshTokenValidate = validateRefreshToken(reftoken);
    const isAccessTokenValidate = validateAccessToken(acctoken);

    // 리프래시 토큰 만료 시(재 로그인 유도)
    if (!isRefreshTokenValidate)
        return res.status(419).json({
            success: false,
            errorMessage:
                "Refresh Token이 만료되었습니다. 재로그인이 필요합니다.",
        });

    // 액세스 토큰 만료 시 리프래시 토큰을 활용하여 재발급
    if (!isAccessTokenValidate) {
        const accessTokenId = await Users.findOne({
            where: { refreshToken: reftoken },
        });

        if (!accessTokenId)
            return res.status(419).json({
                success: true,
                errorMessage: "Access Token정보가 존재하지 않습니다.",
            });

        const newAccessToken = createAccessToken(accessTokenId.id);
        res.cookie("accesstoken", `Bearer ${newAccessToken}`);
        res.json({
            success: true,
            errorMessage: "Access Token을 재발급 성공!",
        });
    }
    try {
        // 토큰 타입 검사
        if (tokenType !== "Bearer" || !tokenType) {
            const err = new TokenTypeUnMatch();
            throw err;
        }
        // accesstoken 검증
        const decodedAccessToken = jwt.verify(acctoken, JWT_TOKENKEY_SECRET);
        const id = decodedAccessToken.id;
        const user = await Users.findOne({ where: { id } });
        if (!user) {
            const err = new UserNotExistError();
            throw err;
        }
        res.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
    //-------------------------------------------------------------
    // AccessToken 검증
    function validateAccessToken(acctoken) {
        try {
            jwt.verify(acctoken, JWT_TOKENKEY_SECRET);
            return true;
        } catch (error) {
            return false;
        }
    }
    // RefreshToken 검증
    function validateRefreshToken(reftoken) {
        try {
            jwt.verify(reftoken, JWT_TOKENKEY_SECRET);
            return true;
        } catch (error) {
            return false;
        }
    }
    function createAccessToken(id) {
        const accessToken = jwt.sign({ id: id }, JWT_TOKENKEY_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        });
        return accessToken;
    }
    //-------------------------------------------------------------
};
export { token_middleware };
