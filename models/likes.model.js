import { Model, DataTypes } from "sequelize";

export default class Likes extends Model {
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
                    allowNull: false,
                    // references: {
                    //     model: "Users", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 id를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Users 모델의 id가 삭제되면, Likes 모델의 데이터가 삭제됩니다.
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    // references: {
                    //     model: "Post", // Post 모델을 참조합니다.
                    //     key: "id", // Post 모델의 id를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Post 모델의 id가 삭제되면, Likes 모델의 데이터가 삭제됩니다.
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Likes",
                tableName: "likes",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Likes.belongsTo(db.Users, {
            foreignKey: "userId",
            targetKey: "id",
        });
        db.Likes.belongsTo(db.Post, {
            foreignKey: "postId",
            targetKey: "id",
        });
    }
}
