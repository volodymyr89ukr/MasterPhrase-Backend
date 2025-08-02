"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("languages", [
      { code: "de", name: "Німецька" },
      { code: "en", name: "Англійська" },
      { code: "uk", name: "Українська" },
      { code: "ru", name: "Російська" },
      { code: "pl", name: "Польська" },
      { code: "es", name: "Іспанська" },
      { code: "it", name: "Італійська" },
      { code: "fr", name: "Французька" },
      { code: "ar", name: "Арабська" },
      { code: "tr", name: "Турецька" },
      { code: "pt", name: "Португальська" },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("languages", null, {});
  },
};
