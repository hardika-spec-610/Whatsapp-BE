import express from "express";
import createHttpError from "http-errors";
import ChatModel from "./model";

const chatRouter = express.Router();

chatRouter.post("/", async (req, res, next) => {
  try {
    const { participants } = req.body;

    // Ensure that participants are provided
    if (!participants || participants.length < 2) {
      res.send(createHttpError(400, "Invalid participants"));
    } else {
      // Create a new conversation
      await ChatModel.create({ participants });
      res.status(201);
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/:chatId", async (req, res, next) => {
  try {
    const { senderId, receiverId, messageText } = req.body;
    const conversationId = req.params.chatId;

    const message = {
      senderId,
      receiverId,
      messageText,
      timestamp: new Date(),
    };

    let conversation = await ChatModel.findById(conversationId);

    if (!conversation) {
      res.send(createHttpError(404, "Conversation not found"));
    } else {
      conversation.messages.push(message);
      await conversation.save();
      res.status(201);
    }
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
