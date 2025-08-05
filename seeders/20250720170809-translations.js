"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "translations",
      [
        // Phrase 1
        {
          id: 1,
          phrase_id: 1,
          field: "phrase",
          language_code: "uk",
          translated_text: "Хліб хороший.",
        },
        {
          id: 2,
          phrase_id: 1,
          field: "explanation",
          language_code: "uk",
          translated_text: "«gut» підходить як прикметник для «Brot».",
        },

        // Phrase 2
        {
          id: 3,
          phrase_id: 2,
          field: "phrase",
          language_code: "uk",
          translated_text: "Авто їде повільно.",
        },
        {
          id: 4,
          phrase_id: 2,
          field: "explanation",
          language_code: "uk",
          translated_text:
            "«langsam» підходить як прислівник до дієслова «fahren».",
        },

        // Phrase 3
        {
          id: 5,
          phrase_id: 3,
          field: "phrase",
          language_code: "uk",
          translated_text: "Будинок новий.",
        },
        {
          id: 6,
          phrase_id: 3,
          field: "explanation",
          language_code: "uk",
          translated_text: "«neu» описує «Haus».",
        },

        // Можеш додати далі за потребою...
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("translations", null, {});
  },
};
