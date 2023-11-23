import { Model, DataTypes } from "sequelize";

export default class Follow extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                followrId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                followedId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Follow",
                tableName: "follow",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Follow.belongsTo(db.Users, {
            foreignKey: "followrId",
            targetKey: "id",
        });
        db.Follow.belongsTo(db.Users, {
            foreignKey: "followedId",
            targetKey: "id",
        });
    }
}
