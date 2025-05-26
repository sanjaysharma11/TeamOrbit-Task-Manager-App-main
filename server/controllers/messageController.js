const { json } = require("express");
const Message = require("../models/Message");


//@desc  Get all message between users
//@route GET /api/messages/:to
//@access Private 
const getMessages = async (req, res) => {
  try {
    const { to } = req.params;
    const from = req.user._id
    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error", error: error.message });
  }
}


const createMessage = async ({ from, to, text }) => {
  const message = new Message({ from, to, text });
  await message.save();
  return message;
}

module.exports = {
  getMessages,
  createMessage
};
