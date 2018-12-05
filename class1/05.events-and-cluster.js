// Example from: https://nodejs.org/api/cluster.html#cluster_event_message

const cluster = require("cluster"),
  http = require("http");

// This works for both main process and workers
process.on("uncaughtException", (err) => {
  console.error(`UNCAUGHT EXCEPTION AT PID #${process.pid}`, err);
  process.exit(1);
});

// This works for both main process and workers
process.on("unhandledRejection", (err) => {
  console.error(`UNHANDLED REJECTION AT PID #${process.pid}`, err);
  process.exit(2);
});

if (cluster.isMaster) {
  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Master handler that receives messages from its workers
  function messageHandler(msg) {
    if (msg.cmd === "notifyRequest") {
      // Count requests
      const worker = cluster.workers[msg.id];
      numReqs += 1;

      if (numReqs === 4) {
        // Test the uncaughtException message
        worker.send({cmd: "throwUncaughtException"});
      } else if (numReqs === 6) {
        // Test the uncaughtRejection message
        worker.send({cmd: "throwUncaughtRejection"});
      } else if (numReqs === 10) {
        // Test the uncaughtRejection (on master, should kill it and all its workers)
        throw new Error(`This exception is not caught at main #${process.pid}!`);
      } else {
        // Tell the worker to send the response with numReqs
        worker.send({cmd: "notifyResponse", numReqs});
      }
    }
  }

  // Start workers and listen for messages
  const numCPUs = require("os").cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // for (const id in cluster.workers) {
  //   // Listen on "message" event for each worker but at main process side
  //   cluster.workers[id].on("message", messageHandler);
  // }

  // This is another (easiest) way to listen for workers messages
  cluster.on("message", (worker, message) => {
    console.log(`Worker #${worker.process.pid} sent a message to master!`);
    console.log("Message: ", message);
    messageHandler(message);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker #${worker.process.pid} died with code ${code} and signal ${signal}`);
  });
} else {
  // Worker processes have a http server
  http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      // Skip favicon requests!
      res.writeHead(404);
      res.end("Not found!");
    } else {
      // Notify master about the request
      process.send({id: cluster.worker.id, cmd: "notifyRequest"});

      // Wait the master answer to send the response (NOTICE: we use once instead of on)
      process.once("message", (msg) => {
        if (msg.cmd === "notifyResponse") {
          res.writeHead(200);
          res.end(`Hello world! This is worker #${process.pid} at request#${msg.numReqs}\n`);
        } else if (msg.cmd === "throwUncaughtException") {
          throw new Error(`This exception is not caught at worker #${process.pid}!`);
        } else if (msg.cmd === "throwUncaughtRejection") {
          Promise.reject(`This rejection is not caught at worker #${process.pid}!`);
        }
      });
    }
  }).listen(8000);

  console.log(`Worker started with PID #${process.pid}`);
}