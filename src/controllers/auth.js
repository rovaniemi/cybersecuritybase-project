import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";
import response from "../helpers/response";

const User = mongoose.model("User");

const privateKey = config.key.privateKey;
const tokenExpireInMinutes = config.key.tokenExpireInMinutes;

exports.authenticate = function(req, res) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (err) throw err;
    console.log(user);
    if (!user) {
      response.sendUnauthorized(res, "Authentication failed.");
    } else if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          const token = jwt.sign(user.getTokenData(), privateKey, {
            expiresIn: tokenExpireInMinutes
          });
          res.cookie("token", token);
          res.redirect("/items");
        } else {
          response.sendUnauthorized(res, "Authentication failed.");
        }
      });
    }
  });
};

exports.verifyToken = function(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, privateKey, function(err, decoded) {
      if (err) {
        res.redirect("/");
      } else {
        User.findById(decoded.id, function(err, user) {
          if (err) res.send(err);
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    res.redirect("/");
  }
};
