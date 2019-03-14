const request = require("request");

// docs: https://any-api.com/github_com/github_com/docs/
function getNodeRepos() {
  const options = {
    url: "https://api.github.com/orgs/nodejs/repos",
    headers: {
      "user-agent": "node-course"
    }
  };

  return new Promise((resolve, reject) => {
    request.get(options, (err, response, body) => {
      if (err) {
        reject(err);
      } else if (response.statusCode === 200) {
        try {
          resolve(JSON.parse(body));
        } catch (ex) {
          console.error(ex);
          // Log the exception but returns an error without any sensitive data!
          reject(new Error("Couldn't get node repos!"));
        }
      } else {
        console.error(response);
        // Log the conflictive response but returns an error without any sensitive data!
        reject(new Error("Couldn't get node repos!"));
      }
    });
  });
}

exports.getNodeRepos = getNodeRepos;
