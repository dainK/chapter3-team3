import { Model, DataTypes } from "sequelize";

export default class Post extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false, // NOT NULL
                    // references: {
                    //     model: "Users", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 id를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Users 모델의 id가 삭제되면, Post 모델의 데이터가 삭제됩니다.
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    // references: {
                    //     model: "Users", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 id를 참조합니다.
                    // },
                    // onDelete: "SET NULL", // 만약 Users 모델의 id가 삭제되면, Post 모델의 categoryId는 null이 됩니다.
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.STRING,
                },
                spec: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Post",
                tableName: "post",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Post.belongsTo(db.Users, { foreignKey: "userId", targetKey: "id" });
        db.Post.belongsTo(db.Category, {
            foreignKey: "categoryId",
            targetKey: "id",
        });

        db.Post.hasMany(db.Comments, { foreignKey: "postId", sourceKey: "id" });
        db.Post.hasMany(db.Likes, { foreignKey: "postId", sourceKey: "id" });
    }
}
