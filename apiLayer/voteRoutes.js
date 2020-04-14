const express = require("express");
const { createVote, readVotes } = require("../dataLayer/modelsIndex");

const voteRouter = express.Router();

voteRouter.post("/", async (req, res, next) => {
  try {
    //req.body needs to have direction, fromUser, forUser
    const data = await createVote(req.body);
    res.send(data);
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

voteRouter.get("/", async (req, res, next) => {
  try {
    const data = await readVotes();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createVote,
  readVotes,
};
