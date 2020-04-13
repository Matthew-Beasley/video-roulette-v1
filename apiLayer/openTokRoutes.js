const express = require("express");
const openTokRouter = express.Router();

// var apiKey = process.env.TOKBOX_API_KEY;
// var secret = process.env.TOKBOX_SECRET;
const apiKey = 46648222;
const secret = "633543163127909d7a0d4e2c3007a4ac486ef81a";

var OpenTok = require("opentok");
var opentok = new OpenTok(apiKey, secret);

// This is not persisted. Redis?
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


openTokRouter.get("/allsessions", (req, res, next) => {
  res.send(roomToSessionIdDictionary);
});


openTokRouter.post("/deletesession/:roomname", (req, res, next) => {
  const { roomname } = req.params;
  delete roomToSessionIdDictionary[roomname];
  res.status(200).send();
});


openTokRouter.get("/pairs", function (req, res) {
  let sessionId;
  let token;

  let roomName = findAvailableRoom();

  // we should now have an available room, if not drop down to create a room
  if (roomToSessionIdDictionary[roomName] &&
    roomToSessionIdDictionary[roomName].connectionCount < 2) {
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
    // ithis is the first time the room is being accessed, create a new session ID
  } else if (!roomName) { 
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "createSession error:" + err });
        return;
      }
      roomName = Object.keys(roomToSessionIdDictionary).length++;

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