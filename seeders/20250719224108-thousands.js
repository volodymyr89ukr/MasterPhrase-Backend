"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("thousands", [
      { name: "1-1000", description: "", language_id: 1 },
      {
        name: "1001-2000",
        description: "",
        language_id: 1,
      },
      {
        name: "2001-3000",
        description: "",
        language_id: 1,
      },
      {
        name: "3001-4000",
        description: "",
        language_id: 1,
      },
      {
        name: "4001-5000",
        description: "",
        language_id: 1,
      },
      { name: "1-1000", description: "", language_id: 2 },
      {
        name: "1001-2000",
        description: "",
        language_id: 2,
      },
      {
        name: "2001-3000",
        description: "",
        language_id: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("thousands", null, {});
  },
};
