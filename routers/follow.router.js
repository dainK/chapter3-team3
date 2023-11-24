import { Router } from "express";
import db from "../models/index.js";
import { validationResult } from "express-validator";
import {
    signupValidate,
    UserEdit,
    UserDelete,
} from "../middlewares/validator.js";
import { ValidError, TokenNotExistError } from "../lib/CustomError.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT_ROUNDS } from "../constants/security.constant.js";
import { token_middleware } from "../middlewares/token_middleware.js";

const { Users, Follow } = db;

const followRouter = Router();

// 팔로우 등록/취소 API
followRouter.put("/:id/follow", token_middleware, async (req, res, next) => {
    const loginId = res.locals.user.id;
    const followedId = parseInt(req.params.id);
    const existUser = await Users.findOne({ where: { id: followedId } });
    const existFollow = await Follow.findOne({ where: { 
        followrId: loginId, 
        followedId: followedId
    }});
    let resultAct = '';

    try {
        // 토큰값이 없으면 에러처리
        if (!loginId) {
            const err = new TokenNotExistError();
            throw err;
        }

        // followed 사용자가 없으면 리턴
        if (!existUser) {
            return res.status(400).json({
                success: false,
                errorMessage: "사용자가 존재하지 않습니다.",
            });
        }

        // 기존 팔로우데이터가 있으면 삭제, 없으면 생성
        if(existFollow){
            resultAct = '취소';
            await Follow.destroy({
                where: { 
                    followrId: loginId, 
                    followedId: followedId 
                }
            })
            .then((result) => {
                console.log("삭제 성공: ", result);
            })
            .catch((err) => {
                console.log("삭제 Error: ", err);
            });
        }
        else{
            resultAct = '등록';
            await Follow.create({ 
                followrId: loginId, 
                followedId: followedId 
            });
        }

        return res.status(200).json({
            sucess: true,
            message: `팔로우 ${resultAct} 성공`
        });
    } catch (err) {
        next(err);
    }
});

export { followRouter };
