const requestsModule = require("./01.requests");

requestsModule.getNodeRepos()
  .then((repos) => {
    console.log(`Found ${repos.length} repos:`, repos.map((repo) => {
      return `${repo.name}: ${repo.clone_url}`;
    }));
  })
  .catch((err) => {
    console.error(err);
  });