const express = require("express");
const openTokRouter = express.Router();

// var apiKey = process.env.TOKBOX_API_KEY;
// var secret = process.env.TOKBOX_SECRET;
const apiKey = 46648222;
const secret = "633543163127909d7a0d4e2c3007a4ac486ef81a";

var OpenTok = require("opentok");
var opentok = new OpenTok(apiKey, secret);

// IMPORTANT: roomToSessionIdDictionary is a variable that associates room names with unique
// unique sesssion IDs. However, since this is stored in memory, restarting your server will
// reset these values if you want to have a room-to-session association in your production
// application you should consider a more persistent storage

var roomToSessionIdDictionary = {};

const findAvailableRoom = () => {
  const candidateRooms = Object.keys(roomToSessionIdDictionary);
  for (let i = 0; i < candidateRooms.length; i++) {
    if (roomToSessionIdDictionary[candidateRooms[i]].connectionCount < 2) {
      return candidateRooms[i];
    }
  }
  return null;
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

openTokRouter.post("/decrimentsession/:roomname", (req, res, next) => {
  const { roomname } = req.params;
  delete roomToSessionIdDictionary[roomname];
  res.status(200).send();
});

/**
 * GET /room/:name
 */
openTokRouter.get("/room", function (req, res) {
  let roomName = req.params.name;
  let sessionId;
  let token;

  roomName = findAvailableRoom();

  // we should now have an available room, if not drop down to create a room
  if (roomToSessionIdDictionary[roomName] &&
    roomToSessionIdDictionary[roomName].connectionCount < 2) {
    console.log("we found an existing room with 1 person in it. ", roomName)
    roomToSessionIdDictionary[roomName].connectionCount++;
    sessionId = roomToSessionIdDictionary[roomName].sessionId;
    console.log("Now we have assigned a sessionID to our room: ", roomName);
    console.log(`the connection count in room ${roomName} is ${roomToSessionIdDictionary[roomName].connectionCount} after we joined`)

    // generate token
    token = opentok.generateToken(sessionId);
    res.setHeader("Content-Type", "application/json");
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token,
      dictionary: roomToSessionIdDictionary,
    });
    // ithis is the first time the room is being accessed, create a new session ID
  } else if (!roomName) { 
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "createSession error:" + err });
        return;
      }
      roomName = Object.keys(roomToSessionIdDictionary).length++;
      // now that the room name has a session associated wit it, store it in memory
      // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
      // if you want to store a room-to-session association in your production application
      // you should use a more persistent storage for them
      console.log("we have to create a new session so we incremented the length of keys to get a new room number ", roomName)
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


module.exports = { openTokRouter };