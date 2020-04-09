const express = require("express");
const path = require("path");
const cors = require("cors");
const _ = require("lodash");
const { buildDB } = require("./dataLayer/modelsIndex");
const { apiRouter } = require("./apiLayer/apiRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    next(error);
  }
});

// var apiKey = process.env.TOKBOX_API_KEY;
// var secret = process.env.TOKBOX_SECRET;
const apiKey = 46648222;
const secret = "633543163127909d7a0d4e2c3007a4ac486ef81a";

if (!apiKey || !secret) {
  console.error(
    "========================================================================================================="
  );
  console.error("");
  console.error("Missing TOKBOX_API_KEY or TOKBOX_SECRET");
  console.error(
    "Find the appropriate values for these by logging into your TokBox Dashboard at: https://tokbox.com/account/#/"
  );
  console.error(
    "Then add them to ",
    path.resolve(".env"),
    "or as environment variables"
  );
  console.error("");
  console.error(
    "========================================================================================================="
  );
  process.exit();
}

var OpenTok = require("opentok");
var opentok = new OpenTok(apiKey, secret);

// IMPORTANT: roomToSessionIdDictionary is a variable that associates room names with unique
// unique sesssion IDs. However, since this is stored in memory, restarting your server will
// reset these values if you want to have a room-to-session association in your production
// application you should consider a more persistent storage

var roomToSessionIdDictionary = {};

// returns the room name, given a session ID that was associated with it
function findRoomFromSessionId(sessionId) {
  return _.findKey(roomToSessionIdDictionary, function (value) {
    return value === sessionId;
  });
}

/**
 * GET /session redirects to /room/session
 */
app.get("/session", function (req, res) {
  res.redirect("/room/session");
});

app.get("/allsessions", (req, res, next) => {
  res.send(roomToSessionIdDictionary);
})

/**
 * GET /room/:name
 */
app.get("/room/:name", function (req, res) {
  const roomName = req.params.name;
  let sessionId;
  let token;
  /*console.log(
    "attempting to create a session associated with the room: " + roomName
  );*/

  // if the room name is associated with a session ID, fetch that
  if (roomToSessionIdDictionary[roomName]) {
    sessionId = roomToSessionIdDictionary[roomName];

    if (sessionId) {
      console.log("Fetching existing session: ", sessionId);//.substring(0, 5));
      console.log("room name is: ", roomName);
      console.log("");
    }

    // generate token
    token = opentok.generateToken(sessionId);
    res.setHeader("Content-Type", "application/json");
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token,
    });
  }
  // if this is the first time the room is being accessed, create a new session ID
  else {
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "createSession error:" + err });
        return;
      }

      // now that the room name has a session associated with it, store it in memory
      // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
      // if you want to store a room-to-session association in your production application
      // you should use a more persistent storage for them
      roomToSessionIdDictionary[roomName] = session.sessionId;
      if (sessionId) {
        console.log("create a new session ID: ", session.sessionId)//.substring(0, 5));
        console.log("room name is: ", roomName);
        console.log("");
      }

      // generate token
      token = opentok.generateToken(session.sessionId);
      res.setHeader("Content-Type", "application/json");
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token,
      });
    });
  }
});

/**
 * POST /archive/start
 */
// app.post("/archive/start", function (req, res) {
//   var json = req.body;
//   var sessionId = json.sessionId;
//   opentok.startArchive(
//     sessionId,
//     { name: findRoomFromSessionId(sessionId) },
//     function (err, archive) {
//       if (err) {
//         console.error("error in startArchive");
//         console.error(err);
//         res.status(500).send({ error: "startArchive error:" + err });
//         return;
//       }
//       res.setHeader("Content-Type", "application/json");
//       res.send(archive);
//     }
//   );
// });

/**
 * POST /archive/:archiveId/stop
 */
// app.post("/archive/:archiveId/stop", function (req, res) {
//   var archiveId = req.params.archiveId;
//   console.log("attempting to stop archive: " + archiveId);
//   opentok.stopArchive(archiveId, function (err, archive) {
//     if (err) {
//       console.error("error in stopArchive");
//       console.error(err);
//       res.status(500).send({ error: "stopArchive error:" + err });
//       return;
//     }
//     res.setHeader("Content-Type", "application/json");
//     res.send(archive);
//   });
// });

/**
 * GET /archive/:archiveId/view
 */
// app.get("/archive/:archiveId/view", function (req, res) {
//   var archiveId = req.params.archiveId;
//   console.log("attempting to view archive: " + archiveId);
//   opentok.getArchive(archiveId, function (err, archive) {
//     if (err) {
//       console.error("error in getArchive");
//       console.error(err);
//       res.status(500).send({ error: "getArchive error:" + err });
//       return;
//     }

//     if (archive.status === "available") {
//       res.redirect(archive.url);
//     } else {
//       res.render("view", { title: "Archiving Pending" });
//     }
//   });
// });

/**
 * GET /archive/:archiveId
 */
// app.get("/archive/:archiveId", function (req, res) {
//   var archiveId = req.params.archiveId;

//   // fetch archive
//   console.log("attempting to fetch archive: " + archiveId);
//   opentok.getArchive(archiveId, function (err, archive) {
//     if (err) {
//       console.error("error in getArchive");
//       console.error(err);
//       res.status(500).send({ error: "getArchive error:" + err });
//       return;
//     }

//     // extract as a JSON object
//     res.setHeader("Content-Type", "application/json");
//     res.send(archive);
//   });
// });

/**
 * GET /archive
 */
// app.get("/archive", function (req, res) {
//   var options = {};
//   if (req.query.count) {
//     options.count = req.query.count;
//   }
//   if (req.query.offset) {
//     options.offset = req.query.offset;
//   }

// list archives
// console.log("attempting to list archives");
// opentok.listArchives(options, function (err, archives) {
//   if (err) {
//     console.error("error in listArchives");
//     console.error(err);
//     res.status(500).send({ error: "infoArchive error:" + err });
//     return;
//   }

// extract as a JSON object
//     res.setHeader("Content-Type", "application/json");
//     res.send(archives);
//   });
// });

//maybe rethink this error handling
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`,
  });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err),
  });
});

buildDB(); // Not crazy about blowing the db away but I guess it's best for dev

app.listen(PORT, () => console.log("Listening on PORT ", PORT));
