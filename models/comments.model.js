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
                    allowNull: false,
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                comment: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Comments",
                tableName: "comments",
                paranoid: true,
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
