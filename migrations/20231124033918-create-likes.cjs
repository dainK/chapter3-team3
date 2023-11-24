'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // NOT NULL
        references: {
          model: 'Users', // Users 모델을 참조합니다.
          key: 'id', // Users 모델의 id를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Users 모델의 id가 삭제되면, Likes 모델의 데이터가 삭제됩니다.
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false, // NOT NULL
        references: {
          model: 'Post', // Post 모델을 참조합니다.
          key: 'id', // Post 모델의 id를 참조합니다.
        },
        onDelete: 'CASCADE', // 만약 Post 모델의 id가 삭제되면, Likes 모델의 데이터가 삭제됩니다.
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};