"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "texts",
      [
        {
          word_set_id: 1, // Набір 1-50
          title: "Tim lernt Deutsch",
          text: "Tim ist ein junger Mann. Er lernt Deutsch, weil er nach Deutschland reisen möchte. Jeden Tag liest er neue Wörter und übt Sätze.",
        },
        {
          word_set_id: 1, // Набір 1-50
          title: "Anna kauft ein",
          text: "Anna geht in den Supermarkt. Sie kauft Brot, Milch und Käse. An der Kasse zahlt sie mit ihrer Karte.",
        },
        {
          word_set_id: 3, // Набір 101-150
          title: "Die erste Arbeit",
          text: "Markus hat seine erste Arbeit gefunden. Er ist ein bisschen nervös, aber auch sehr motiviert. Sein Chef ist freundlich und erklärt alles genau.",
        },
        {
          word_set_id: 4, // Набір 151-200
          title: "Das neue Projekt",
          text: "Im Büro startet ein neues Projekt. Das Team arbeitet zusammen und hat regelmäßige Meetings, um den Fortschritt zu besprechen.",
        },
        {
          word_set_id: 11, // Набір зі словами 501-550
          title: "Tom's Daily Routine",
          text: "Tom wakes up early every morning. He eats breakfast and drinks coffee. Then he goes to work by car. In the evening, he reads books and watches TV.",
        },
        {
          word_set_id: 11, // Набір зі словами 501-550
          title: "At School",
          text: "Children sit at tables in the classroom. The teacher writes on the paper with a pen. Students open their books and learn new words. They are happy when they understand.",
        },
        {
          word_set_id: 11, // Набір зі словами 501-550
          title: "The Park",
          text: "The sun is bright in the sky. A big tree gives shade. Dogs run and play. People walk on the grass. Some sit on chairs and talk with friends.",
        },
        {
          word_set_id: 12, // Набір зі словами 551-600
          title: "Four Seasons",
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
