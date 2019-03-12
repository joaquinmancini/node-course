/* eslint func-style: 0, one-var: 0 */

const teams = [
  {
    name: "Rusia",
    box: 0,
    group: "A"
  },
  {
    name: "Argentina",
    box: 1,
    group: ""
  },
  {
    name: "Alemania",
    box: 1,
    group: ""
  },
  {
    name: "Brasil",
    box: 1,
    group: ""
  },
  {
    name: "Francia",
    box: 1,
    group: ""
  },
  {
    name: "Portugal",
    box: 1,
    group: ""
  },
  {
    name: "Polonia",
    box: 1,
    group: ""
  },
  {
    name: "Bélgica",
    box: 1,
    group: ""
  },
  {
    name: "España",
    box: 2,
    group: ""
  },
  {
    name: "Peru",
    box: 2,
    group: ""
  },
  {
    name: "Suiza",
    box: 2,
    group: ""
  },
  {
    name: "Inglaterra",
    box: 2,
    group: ""
  },
  {
    name: "Colombia",
    box: 2,
    group: ""
  },
  {
    name: "Mexico",
    box: 2,
    group: ""
  },
  {
    name: "Uruguay",
    box: 2,
    group: ""
  },
  {
    name: "Croacia",
    box: 2,
    group: ""
  },
  {
    name: "Dinamarca",
    box: 3,
    group: ""
  },
  {
    name: "Islandia",
    box: 3,
    group: ""
  },
  {
    name: "Costa Rica",
    box: 3,
    group: ""
  },
  {
    name: "Suecia",
    box: 3,
    group: ""
  },
  {
    name: "Túnez",
    box: 3,
    group: ""
  },
  {
    name: "Egipto",
    box: 3,
    group: ""
  },
  {
    name: "Senegal",
    box: 3,
    group: ""
  },
  {
    name: "Iran",
    box: 3,
    group: ""
  },
  {
    name: "Serbia",
    box: 4,
    group: ""
  },
  {
    name: "Nigeria",
    box: 4,
    group: ""
  },
  {
    name: "Australia",
    box: 4,
    group: ""
  },
  {
    name: "Japón",
    box: 4,
    group: ""
  },
  {
    name: "Marruecos",
    box: 4,
    group: ""
  },
  {
    name: "Panama",
    box: 4,
    group: ""
  },
  {
    name: "Corea del Sur",
    box: 4,
    group: ""
  },
  {
    name: "Arabia Saudita",
    box: 4,
    group: ""
  }
];


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTeamsForBox(box) {
  return teams.filter(t => t.box === box);
}

function getTeamsForGroup(group) {
  return teams.filter(t => t.group === group);
}


/** 
 * Rusia entra directo como cabeza de serie al grupo A (país organizador)
 * del box 1 sale cada cabeza de serie (para el grupo B al H)
 * del box 2 salen los 3ros de cada grupo
 * del box 3 uno a cada grupo y lo mismo del 4
 */
function simulate() {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

  for (let box = 1; box <= 4; box++) {
    const teamsForBox = shuffle(getTeamsForBox(box));

    teamsForBox.forEach((team, index) => {
      team.group = groups[index + (box === 1 ? 1 : 0)];
    });
  }

  console.log("Resultados del sorteo:");
  groups.forEach((g) => {
    console.log(`Grupo ${g}:`);
    const teamNames = getTeamsForGroup(g).map(t => `${t.name} (${t.box})`);
    console.log(teamNames.join(", "));
  });
}

simulate();