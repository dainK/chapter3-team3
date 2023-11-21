import { Model, DataTypes } from "sequelize";

export default class Users extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                nickName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                imgUrl: {
                    type: DataTypes.STRING,
                    defaultValue: "temp",
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Users",
                tableName: "users",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Users.hasMany(db.Post, { foreignKey: "userId", sourceKey: "id" });
        db.Users.hasMany(db.Comments, {
            foreignKey: "userId",
            sourceKey: "id",
        });
        db.Users.hasMany(db.Follow, {
            foreignKey: "followrId",
            sourceKey: "id",
        });
        db.Users.hasMany(db.Follow, {
            foreignKey: "followedId",
            sourceKey: "id",
        });
    }
}
