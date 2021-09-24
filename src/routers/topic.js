const express = require("express");
const Topic = require("../models/topic");
const router = new express.Router();

//for Create user or Register user
router.post("/topics", async (req, res) => {
  const topic = new Topic(req.body);

  try {
    await topic.save();
    res.status(201).send(topic);
  } catch (e) {
    res.status(400).send(e);
  }
});

//for get all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.send(topics);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
