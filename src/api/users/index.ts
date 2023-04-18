import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";
import passport from "passport";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { RequestHandler, Request } from "express";

const usersRouter = express.Router();
interface googleRequest extends Request {
  user?: { _id?: string; status?: "online" | "offline"; accessToken?: string };
}

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  (req: googleRequest, res, next) => {
    try {
      res.redirect(
        `${process.env.FE_DEV_URL}/home?accessToken=${req.user?.accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/",

  async (req, res, next) => {
    try {
      const newAuthor = new UsersModel(req.body);
      const { _id } = await newAuthor.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get(
  "/",
  // basicAuthMiddleware,
  JWTAuthMiddleware,

  async (req, res, next) => {
    try {
      const authors = await UsersModel.find();
      res.send(authors);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
