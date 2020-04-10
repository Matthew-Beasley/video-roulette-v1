const express = require("express");
const openTokRouter = express.Router();

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
openTokRouter.get("/session", function (req, res, next) {
  res.redirect("/room/session");
});

openTokRouter.get("/allsessions", (req, res, next) => {
  res.send(roomToSessionIdDictionary);
});

// app.get("/streams/:sessionId", async (req, res, next) => {
//   const { sessionId } = req.params;
//   const response = await axios.get(
//     `https://api.opentok.com/v2/project/${apiKey}/session/${sessionId}/stream/`
//   );
//   res.send(response.data);
// });

/**
 * GET /room/:name
 */
openTokRouter.get("/room/:name", function (req, res) {
  let roomName = req.params.name;

  let sessionId;
  let token;
  console.log(
    "attempting to create a session associated with the room: " + roomName
  );

  // if the room name is associated with a session ID, fetch that
  // if (roomToSessionIdDictionary[roomName]) {
  //   sessionId = roomToSessionIdDictionary[roomName];
  if (roomToSessionIdDictionary[roomName] &&
      roomToSessionIdDictionary[roomName].connectionCount < 2) {

    console.log("this is in the if logic: ", roomToSessionIdDictionary);
    roomToSessionIdDictionary[roomName].connectionCount++;
    sessionId = roomToSessionIdDictionary[roomName].sessionId;

    // generate token
    token = opentok.generateToken(sessionId);
    res.setHeader("Content-Type", "application/json");
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token,
      dictionary: roomToSessionIdDictionary,
    });
  }
  // if this is the first time the room is being accessed, create a new session ID
  else {
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      console.log("this is in create session", roomToSessionIdDictionary);
      if (err) {
        console.log(err);
        res.status(500).send({ error: "createSession error:" + err });
        return;
      }

      // now that the room name has a session associated wit it, store it in memory
      // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
      // if you want to store a room-to-session association in your production application
      // you should use a more persistent storage for them
      roomToSessionIdDictionary[roomName] = {
        sessionId: session.sessionId,
        connectionCount: 1,
      };

      // generate token
      token = opentok.generateToken(session.sessionId);
      res.setHeader("Content-Type", "application/json");
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token,
        dictionary: roomToSessionIdDictionary,
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

module.exports = { openTokRouter };