import express from "express";

import users from "../../controllers/users";
import auth from "../../controllers/auth";

const routes = express.Router();

routes.route("/signup").post(users.create);
routes.route("/signin").post(auth.authenticate);

routes
  .route("/:id")
  .all(auth.verifyToken)
  .get(users.read)
  .put(users.update)
  .delete(users.delete);

routes
  .route("/")
  .get(auth.verifyToken, users.list)
  .post(users.create);

module.exports = routes;
