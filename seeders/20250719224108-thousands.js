"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("thousands", [
      { id: 1, name: "1-1000", description: "", language_id: 1 },
      { id: 2, name: "1001-2000", description: "", language_id: 1 },
      { id: 3, name: "2001-3000", description: "", language_id: 1 },
      { id: 4, name: "3001-4000", description: "", language_id: 1 },
      { id: 5, name: "4001-5000", description: "", language_id: 1 },
      { id: 6, name: "1-1000", description: "", language_id: 2 },
      { id: 7, name: "1001-2000", description: "", language_id: 2 },
      { id: 8, name: "2001-3000", description: "", language_id: 2 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("thousands", null, {});
  },
};
