import Sequelize from "sequelize";
import configEX from "../config/config.js";
import Users from "./users.model.js";
import Category from "./category.model.js";
import Post from "./post.model.js";
import Comments from "./comments.model.js";
import Follow from "./follow.model.js";
import Likes from "./likes.model.js";
import dotenv from "dotenv";
dotenv.config();

// 환경변수에 따라 config를 설정
const env = process.env.NODE_ENV || "development";
const config = configEX[env];

const db = {};

// db 객체에 sequelize 객체를 저장
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);


db.Users = Users;
db.Category = Category;
db.Follow = Follow;
db.Post = Post;
db.Comments = Comments;
db.Likes = Likes;

Users.init(sequelize);
Category.init(sequelize);
Follow.init(sequelize);
Post.init(sequelize);
Comments.init(sequelize);
Likes.init(sequelize);

Users.associate(db);
Category.associate(db);
Follow.associate(db);
Post.associate(db);
Comments.associate(db);
Likes.associate(db);
Follow.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
