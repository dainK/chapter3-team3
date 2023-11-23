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
                    allowNull: false,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
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
                imgUrl: {
                    type: DataTypes.STRING,
                    defaultValue: "temp",
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Post",
                tableName: "post",
                paranoid: true,
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
    }
}
