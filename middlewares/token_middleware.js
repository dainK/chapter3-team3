import jwt from "jsonwebtoken";
import db from "../models/index.js";
import {
    TokenNotExistError,
    TokenTypeUnMatch,
    UserNotExistError,
} from "../lib/CustomError.js";
import { JWT_TOKENKEY_SECRET } from "../constants/security.constant.js";
const { Users } = db;

const token_middleware = async (req, res, next) => {
    try {
        const { authorization } = req.cookies;

        if (!authorization) {
            const err = new TokenNotExistError();
            throw err;
        }
        const [tokenType, token] = authorization.split(" ");
        // tokenType : Bearer / token : 실제 jwt 값

        if (tokenType !== "Bearer" || !tokenType) {
            const err = new TokenTypeUnMatch();
            throw err;
        }

        const decodedToken = jwt.verify(token, JWT_TOKENKEY_SECRET);
        const id = decodedToken.id;
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
};
export { token_middleware };
