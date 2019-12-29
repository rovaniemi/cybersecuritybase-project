import express from "express";

import auth from "./auth";
import users from "./users";
import items from "./items";
import response from "../helpers/response";

const routes = express.Router();

routes.use(response.setHeadersForCORS);

routes.use("/", auth);
routes.use("/users", users);
routes.use("/items", items);

routes.get("/", (req, res) => {
  res.render("index");
});

routes.get("/signup", (req, res) => {
  res.render("signup");
});

routes.use(function(req, res) {
  response.sendNotFound(res);
});

module.exports = routes;
