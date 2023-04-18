"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import GoogleStrategy from "passport-google-oauth20";
// import GoogleStrategy = require("passport-google-oauth20");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const tools_js_1 = require("./tools.js");
const model_1 = __importDefault(require("../../api/users/model"));
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`,
}, (_, __, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    // This function is executed when Google sends us a successfull response
    // Here we are going to receive some informations about the user from Google (scopes --> profile, email)
    try {
        const { email, given_name, sub } = profile._json;
        console.log("PROFILE:", profile);
        // 1. Check if the user is already in db
        const user = yield model_1.default.findOne({ email });
        if (user) {
            // 2. If he is there --> generate an accessToken (optionally also a refreshToken)
            const accessToken = yield (0, tools_js_1.createAccessToken)({
                _id: user._id,
                status: user.status,
            });
            console.log("accessToken", accessToken);
            // 2.1 Then we can go next (to /auth/google/callback route handler function)
            passportNext(null, { accessToken });
        }
        else {
            // 3. If user is not in our db --> create that
            const newUser = new model_1.default({
                username: given_name,
                email,
                googleId: sub,
            });
            const createdUser = yield newUser.save();
            // 3.1 Then generate an accessToken (optionally also a refreshToken)
            const accessToken = yield (0, tools_js_1.createAccessToken)({
                _id: createdUser._id,
                status: createdUser.status,
            });
            // 3.2 Then we go next (to /auth/google/callback route handler function)
            passportNext(null, { accessToken });
        }
    }
    catch (error) {
        // 4. In case of errors we gonna catch'em and handle them
        passportNext(error);
    }
}));
exports.default = googleStrategy;
