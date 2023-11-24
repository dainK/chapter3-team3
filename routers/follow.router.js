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

// 팔로우 목록 조회 API
followRouter.get("/followers", token_middleware, async (req, res, next) => {
    const loginId = res.locals.user.id;

    try {
        const userList = await Users.findAll({
            include: [{
                model: Follow,
                where: {
                    followrId: loginId
                },
                required: true
            }]
        });

        return res.status(200).json({
            sucess: true,
            message: "팔로우 목록 조회 성공",
            data: userList,
        });
    } catch (err) {
        next(err);
    }
});

// 팔로우드 목록 조회 API
followRouter.get("/followeds", token_middleware, async (req, res, next) => {
    const loginId = res.locals.user.id;

    try {
        // 이부분 원하는 결과가 안나와서 문의필요
        // const userList = await Users.findAll({
        //     include: [{
        //         model: Follow,
        //         where: {
        //             followedId: loginId
        //         },
        //         required: true
        //     }]
        // });

        const followList = await Follow.findAll({
            where: {
                followedId: loginId
            }
        });

        const userIdList = followList.map((e)=>{ return e.followrId; });
        
        const userList = await Users.findAll({
            where: {
                id: {
                    [db.Sequelize.Op.in]: userIdList
                }
            }
        });

        return res.status(200).json({
            sucess: true,
            message: "팔로우드 목록 조회 성공",
            data: userList,
        });
    } catch (err) {
        next(err);
    }
});

export { followRouter };
