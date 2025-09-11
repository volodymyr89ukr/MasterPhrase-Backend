"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("languages", [
      { id: 1, code: "de", name: "Німецька" },
      { id: 2, code: "en", name: "Англійська" },
      { id: 3, code: "uk", name: "Українська" },
      { id: 4, code: "ru", name: "Російська" },
      { id: 5, code: "pl", name: "Польська" },
      { id: 6, code: "es", name: "Іспанська" },
      { id: 7, code: "it", name: "Італійська" },
      { id: 8, code: "fr", name: "Французька" },
      { id: 9, code: "ar", name: "Арабська" },
      { id: 10, code: "tr", name: "Турецька" },
      { id: 11, code: "pt", name: "Португальська" },
      { id: 12, code: "hu", name: "Угорська" },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("languages", null, {});
  },
};
