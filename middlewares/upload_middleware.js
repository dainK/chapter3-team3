import multer from"multer";
import multerS3 from"multer-s3";
import path from"path";
import s3 from "../config/s3.config.js"
import {JWT_TOKENKEY_SECRET} from "../constants/security.constant.js";
import jwt from "jsonwebtoken";

// 확장자 검사 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];

// Multer-S3 설정
const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async (req, file, callback) => {
        try {
          // 날짜와 랜덤 번호 생성
          const date = new Date().toISOString().split("T")[0];
          const randomNumber = Math.random().toString(36).substr(2, 8);

          // 확장자 검사
          const extension = path.extname(file.originalname).toLowerCase();
          if (!allowedExtensions.includes(extension)) {
            return callback(new Error("Invalid file type"));
          }
          
        const { accesstoken, refreshtoken } = req.cookies;
        const [tokenType, acctoken] = accesstoken.split(" ");
        const decodedAccessToken = jwt.verify(acctoken, JWT_TOKENKEY_SECRET);
        const id = decodedAccessToken.id;

          // 파일명 생성
          const filename = `userprofile/${id}_${extension}`;
          callback(null, filename);
        } catch (error) {
          return callback(new Error("Invalid or expired token"));
        }
    },
    acl: "public-read-write",
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadImage;
// module.exports = uploadImage;