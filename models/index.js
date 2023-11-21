import Sequelize from "sequelize";
import * as configEX from "../config/config.js";
import Users from "./users.model.js";
import Category from "./category.model.js";
import Post from "./post.model.js";
import Comments from "./comments.model.js";
import Follow from "./follow.model.js";

// 환경변수에 따라 config를 설정
const env = process.env.NODE_ENV || "development";
const config = configEX[env];
console.log(config);
const db = {};

// db 객체에 sequelize 객체를 저장
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Users = Users;
// db.Category = Category;
// db.Post = Post;
// db.Comments = Comments;
// db.Follow = Follow;

// Users.init(sequelize);
// Category.init(sequelize);
// Comments.init(sequelize);
// Post.init(sequelize);
// Follow.init(sequelize);

// Users.associate(db);
// Category.associate(db);
// Post.associate(db);
// Comments.associate(db);
// Follow.associate(db);

export default db;
