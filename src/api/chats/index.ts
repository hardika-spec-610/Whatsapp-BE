import express from "express";
import createHttpError from "http-errors";
import ChatModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { JwtPayload } from "jsonwebtoken";

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
      res.status(201).send({ message: "Conversation created successfully" });
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
      res.status(201).send({ message: "Message created successfully" });
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/me", JWTAuthMiddleware, async (req: JwtPayload, res, next) => {
  try {
    const userId = req.req.user?._id;

    // Find all chats where the user is a participant and populate the sender and receiver avatars
    const chats = await ChatModel.find({ participants: userId }).populate({
      path: "participants",
      match: { _id: { $ne: userId } }, // find participants other than the current user
      select: "avatar",
    });

    res.json(chats);
  } catch (error) {
    next(error);
  }
});

/* chatRouter.get("/me/:userId", async (req: JwtPayload, res, next) => {
  try {
    const userId = req.params.userId;

    // Find all chats where the user is a participant and populate the sender and receiver avatars
    const chats = await ChatModel.find({ participants: userId }).populate({
      path: "participants",
      match: { _id: { $ne: userId } }, // find participants other than the current user
      select: "avatar",
    });

    res.json(chats);
  } catch (error) {
    next(error);
  }
}); */

export default chatRouter;
