"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Припускаємо, що таблиця thousands має записи з id 1, 2, 3, 4
    await queryInterface.bulkInsert(
      "word_sets",
      [
        {
          word_set: "1-50",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "51-100",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "101-150",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "151-200",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "201-250",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "251-300",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "301-350",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "351-400",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "401-450",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "451-500",
          thousand_id: 1, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "1-50 EN",
          thousand_id: 6, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "51-100 EN",
          thousand_id: 6, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "101-150 EN",
          thousand_id: 6, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          word_set: "151-200 EN",
          thousand_id: 6, // <-- ДОДАНО!
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("word_sets", null, {});
  },
};
