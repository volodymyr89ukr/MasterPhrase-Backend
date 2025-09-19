"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("thousands", [
      { id: 1, name: "1-300", description: "", language_id: 1 },
      { id: 2, name: "301-600", description: "", language_id: 1 },
      { id: 3, name: "601-900", description: "", language_id: 1 },
      { id: 4, name: "901-1200", description: "", language_id: 1 },
      { id: 5, name: "1201-1500", description: "", language_id: 1 },
      { id: 6, name: "1501-1800", description: "", language_id: 1 },
      // { id: 7, name: "1801-2100", description: "", language_id: 1 },
      // { id: 8, name: "2101-2400", description: "", language_id: 1 },
      // { id: 9, name: "2401-2700", description: "", language_id: 1 },
      // { id: 10, name: "2701-3000", description: "", language_id: 1 },
      // { id: 11, name: "3001-3300", description: "", language_id: 1 },
      // { id: 12, name: "3301-3600", description: "", language_id: 1 },
      // { id: 13, name: "3601-3900", description: "", language_id: 1 },
      // { id: 14, name: "3901-4200", description: "", language_id: 1 },
      // { id: 15, name: "4201-4500", description: "", language_id: 1 },
      // { id: 16, name: "4501-4800", description: "", language_id: 1 },
      // { id: 17, name: "4801-5100", description: "", language_id: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("thousands", null, {});
  },
};
