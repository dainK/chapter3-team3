// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Post', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false, // NOT NULL
//         references: {
//           model: 'Users', // Users 모델을 참조합니다.
//           key: 'id', // Users 모델의 id를 참조합니다.
//         },
//         onDelete: 'CASCADE', // 만약 Users 모델의 id가 삭제되면, Post 모델의 데이터가 삭제됩니다.
//       },
//       categoryId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Users', // Users 모델을 참조합니다.
//           key: 'id', // Users 모델의 id를 참조합니다.
//         },
//         onDelete: 'SET NULL', // 만약 Users 모델의 id가 삭제되면, Post 모델의 categoryId는 null이 됩니다.
//       },
//       title: {
//         type: Sequelize.STRING
//       },
//       content: {
//         type: Sequelize.STRING
//       },
//       spec: {
//         type: Sequelize.STRING
//       },
//       imgUrl: {
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Post');
//   }
// };