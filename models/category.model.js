import { Model, DataTypes } from "sequelize";

export default class Category extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Category",
                tableName: "category",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            },
        );
    }

    static associate(db) {
        db.Category.hasMany(db.Post, {
            foreignKey: "categoryId",
            sourceKey: "id",
        });
    }
}
