"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAccessToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
})); // Input: payload, Output: Promise which resolves into the token
exports.createAccessToken = createAccessToken;
const verifyAccessToken = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
        reject(err);
    else
        resolve(payload);
})); // Input: token, Output: Promise which resolves into the original payload
exports.verifyAccessToken = verifyAccessToken;
