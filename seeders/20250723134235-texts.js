"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "texts",
      [
        {
          id: 1,
          word_set_id: 1, // Набір 1-50
          title: "1",
          text: "Tim ist ein junger Mann. Er lernt Deutsch, weil er nach Deutschland reisen möchte. Jeden Tag liest er neue Wörter und übt Sätze.",
        },
        {
          id: 3,
          word_set_id: 21, // Набір 101-150
          title: "3",
          text: "Markus hat seine erste Arbeit gefunden. Er ist ein bisschen nervös, aber auch sehr motiviert. Sein Chef ist freundlich und erklärt alles genau.",
        },
        {
          id: 4,
          word_set_id: 21, // Набір 151-200
          title: "4",
          text: "Im Büro startet ein neues Projekt. Das Team arbeitet zusammen und hat regelmäßige Meetings, um den Fortschritt zu besprechen.",
        },
        {
          id: 5,
          word_set_id: 21, // Набір зі словами 501-550
          title: "5",
          text: "Tom wakes up early every morning. He eats breakfast and drinks coffee. Then he goes to work by car. In the evening, he reads books and watches TV.",
        },
        {
          id: 6,
          word_set_id: 21, // Набір зі словами 501-550
          title: "6",
          text: "Children sit at tables in the classroom. The teacher writes on the paper with a pen. Students open their books and learn new words. They are happy when they understand.",
        },
        {
          id: 7,
          word_set_id: 2, // Набір зі словами 501-550
          title: "7",
          text: "The sun is bright in the sky. A big tree gives shade. Dogs run and play. People walk on the grass. Some sit on chairs and talk with friends.",
        },
        {
          id: 8,
          word_set_id: 2, // Набір зі словами 551-600
          title: "8",
          text: "In spring, flowers are red and yellow. Summer is hot with blue sky. In autumn, trees lose leaves. Winter brings cold and snow. Every season is beautiful.",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("texts", null, {});
  },
};
