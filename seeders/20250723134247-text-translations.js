"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "text_translations",
      [
        {
          id: 1,
          text_id: 1,
          language_code: "uk",
          translated_text:
            "Тім — молодий хлопець. Він вивчає німецьку, бо хоче поїхати до Німеччини. Щодня він читає нові слова і тренує речення.",
        },
        {
          id: 2,
          text_id: 2,
          language_code: "uk",
          translated_text:
            "Анна йде до супермаркету. Вона купує хліб, молоко і сир. На касі вона платить карткою.",
        },
        {
          id: 3,
          text_id: 3,
          language_code: "uk",
          translated_text:
            "Марк знайшов свою першу роботу. Він трохи хвилюється, але дуже мотивований. Його начальник доброзичливий і все докладно пояснює.",
        },
        {
          id: 4,
          text_id: 4,
          language_code: "uk",
          translated_text:
            "В офісі стартує новий проект. Команда працює разом і проводить регулярні зустрічі, щоб обговорити прогрес.",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("text_translations", null, {});
  },
};
