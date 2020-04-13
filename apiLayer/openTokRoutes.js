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

const findAvailableRoom = (roomName) => {
  const candidateRooms = Object.keys(roomToSessionIdDictionary);
  const availableRoom = candidateRooms.reduce((acc, candidate) => {
    if (roomToSessionIdDictionary[candidate].connectionCount < 2) {
      acc = candidate;
    }
    return candidate;
  }, 1);
  if (availableRoom !== 0) {
    return availableRoom;
  } else {
    return roomName;
  }
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
  console.log(`connectionCount in room ${roomname} before leave called is ${roomToSessionIdDictionary[roomname].connectionCount}`)
  if (roomToSessionIdDictionary[roomname].connectionCount >= 1) {
    roomToSessionIdDictionary[roomname].connectionCount--;
    console.log(`connectionCount in room ${roomname} after leave called is ${roomToSessionIdDictionary[roomname].connectionCount}`)
  }
  if (roomToSessionIdDictionary[roomname].connectionCount < 1) {
    delete roomToSessionIdDictionary[roomname];
    console.log(`${roomname} was deleted from dictionary`)
    console.log(`this is the new dictionary ${JSON.stringify(roomToSessionIdDictionary)}`)
  }
  res.status(200).send();
});

/**
 * GET /room/:name
 */
openTokRouter.get("/room/:name", function (req, res) {
  let roomName = req.params.name;
  let sessionId;
  let token;

  // if the room name is associated with a session ID, check number of occupants
  console.log("we are starting with room: ", roomName)
  if (roomToSessionIdDictionary[roomName] &&
    roomToSessionIdDictionary[roomName].connectionCount >= 2) {
    // if our room isn't available, try to find one
    roomName = findAvailableRoom(roomName);
    console.log("The room was full, so we randomly generated a new one: ", roomName);
    console.log(`the connection count in room ${roomName} is ${roomToSessionIdDictionary[roomName].connectionCount}`)
  }

  // we should now have an available room, if not drop down to create a room
  if (roomToSessionIdDictionary[roomName] &&
    roomToSessionIdDictionary[roomName].connectionCount < 2) {

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
  } else { // ithis is the first time the room is being accessed, create a new session ID
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