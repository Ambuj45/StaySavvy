const express = require("express");
const router = express.Router();
const roomModel = require("../models/rooms");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await roomModel.find({});
    res.send(rooms);
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomid = req.body.roomid;
  try {
    const room = await roomModel.findOne({ _id: roomid });
    res.send(room);
  } catch (error) {
    return res.status(400).json({ messsage: error });
  }
});

router.post("/addroom", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.send("New Room added Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});
module.exports = router;
