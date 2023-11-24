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
                    allowNull: false, // NOT NULL
                    // references: {
                    //     model: "Users", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 id를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Users 모델의 id가 삭제되면, Follow 모델의 데이터가 삭제됩니다.
                },
                followedId: {
                    type: DataTypes.INTEGER,
                    allowNull: false, // NOT NULL
                    // references: {
                    //     model: "Users", // Users 모델을 참조합니다.
                    //     key: "id", // Users 모델의 id를 참조합니다.
                    // },
                    // onDelete: "CASCADE", // 만약 Users 모델의 id가 삭제되면, Follow 모델의 데이터가 삭제됩니다.
                },
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
