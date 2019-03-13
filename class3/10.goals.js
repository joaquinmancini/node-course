/* eslint func-style: 0 */

const goals = [
  {
    player: "Messi",
    team: "Barcelona",
    against: "Real Madrid",
    score: "1-0",
    minute: 90
  },
  {
    player: "Iniesta",
    team: "Barcelona",
    against: "Real Madrid",
    score: "2-1",
    minute: 10
  },
  {
    player: "Messi",
    team: "Barcelona",
    against: "Estudiantes",
    score: "1-0",
    minute: 88
  },
  {
    player: "Tevez",
    team: "Boca",
    against: "River",
    score: "3-2",
    minute: 80
  }
];

function getGoalsFrom(player) {
  return goals.filter(g => g.player.toLowerCase() === player.toLowerCase());
}

function asyncTaskAndGetGoals(err, callback) {
  setTimeout(() => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, goals);
  }, 100);
}

function asyncPromiseAndGetGoals() {
  return Promise.resolve(goals);
}

function asyncPromiseReject() {
  return Promise.reject("This is an error!");
}

module.exports = {
  goals,
  getGoalsFrom,
  asyncTaskAndGetGoals,
  asyncPromiseAndGetGoals,
  asyncPromiseReject
};