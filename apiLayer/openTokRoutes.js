const express = require("express");
const openTokRouter = express.Router();

const apiKey = process.env.TOKBOX_API_KEY;
const secret = process.env.TOKBOX_SECRET;

var OpenTok = require("opentok");
var opentok = new OpenTok(apiKey, secret);

// This is not persisted. Redis?
var roomToSessionIdDictionary = {};

const findAvailableRoom = (participants) => {
  const candidateRooms = Object.keys(roomToSessionIdDictionary);
  for (let i = 0; i < candidateRooms.length; i++) {
    if (roomToSessionIdDictionary[candidateRooms[i]].connectionCount < participants) {
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


openTokRouter.post("/decrimentsession/:roomname", (req, res, next) => {
  const { roomname } = req.params;
  roomToSessionIdDictionary[roomname].connectionCount--;
  if (roomToSessionIdDictionary[roomname].connectionCount <= 0) {
    delete roomToSessionIdDictionary[roomname];
  }
  res.status(201).send();
});


openTokRouter.post("/chat/:memberscount", function (req, res, next) {
  let sessionId;
  let token;
  const tokenOptions = {};
  const { memberscount } = req.params;
  const { user } = req.body;
  let roomName = findAvailableRoom(memberscount);

  // we should now have an available room, if not drop down to create a room
  if (roomName) {
    roomToSessionIdDictionary[roomName].connectionCount++;
    sessionId = roomToSessionIdDictionary[roomName].sessionId;
    // generate token
    tokenOptions.role = "publisher";
    tokenOptions.data = `{"userName":"${user.userName}", "email":"${user.email}"}`;
    token = opentok.generateToken(sessionId, tokenOptions);
    res.setHeader("Content-Type", "application/json");
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token,
      roomName: roomName,
    });
    // this is the first time the room is being accessed, create a new session ID
  } else if (!roomName) {
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "createSession error:" + err });
        return;
      }
      roomName = Object.keys(roomToSessionIdDictionary).length++;
      roomToSessionIdDictionary[roomName] = {
        sessionId: session.sessionId,
        connectionCount: 1,
      };

      // generate token
      tokenOptions.role = "publisher";
      tokenOptions.data = `{"userName":"${user.userName}", "email":"${user.email}"}`;
      token = opentok.generateToken(session.sessionId, tokenOptions);
      res.setHeader("Content-Type", "application/json");
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token,
        roomName: roomName,
      });
    });
  }
});

module.exports = openTokRouter;
