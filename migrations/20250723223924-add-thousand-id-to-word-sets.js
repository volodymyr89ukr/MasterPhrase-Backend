"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("word_sets", "thousand_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "thousands",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("word_sets", "thousand_id");
  },
};
