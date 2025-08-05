"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "word_sets",
      [
        {
          id: 1,
          word_set: "1-50",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          word_set: "51-100",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          word_set: "101-150",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          word_set: "151-200",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          word_set: "201-250",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          word_set: "251-300",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          word_set: "301-350",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          word_set: "351-400",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 9,
          word_set: "401-450",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 10,
          word_set: "451-500",
          thousand_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 11,
          word_set: "1-50 EN",
          thousand_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 12,
          word_set: "51-100 EN",
          thousand_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 13,
          word_set: "101-150 EN",
          thousand_id: 6,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 14,
          word_set: "151-200 EN",
          thousand_id: 6,
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
