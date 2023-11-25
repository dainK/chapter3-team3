import { Model, DataTypes } from "sequelize";

export default class Comments extends Model {
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
                    // onDelete: "CASCADE", // 만약 Users 모델의 id가 삭제되면, Comment 모델의 데이터가 삭제됩니다.
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false, // NOT NULL
                    // references: {
                    //     model: "Post", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 userId를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Post 모델의 id가 삭제되면, Comment 모델의 데이터가 삭제됩니다.
                },
                comment: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Comments",
                tableName: "comments",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Comments.belongsTo(db.Users, {
            foreignKey: "userId",
            targetKey: "id",
        });
        db.Comments.belongsTo(db.Post, {
            foreignKey: "postId",
            targetKey: "id",
        });
    }
}
