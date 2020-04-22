const express = require("express");
const {
  createVote,
  readVoterVotes,
  readVoteeVotes
} = require("../dataLayer/modelsIndex");

const voteRouter = express.Router();

voteRouter.post("/", async (req, res, next) => {
  try {
    const response = await createVote(req.body);
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
});

voteRouter.get("/voter/:voter", async (req, res, next) => {
  try {
    const data = await readVoterVotes(req.params.voter);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

voteRouter.get("/votee/:votee", async (req, res, next) => {
  try {
    const data = await readVoteeVotes(req.params.votee);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = { voteRouter };
