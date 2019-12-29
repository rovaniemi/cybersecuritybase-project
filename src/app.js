import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import path from "path";

import User from "./models/user";
import Item from "./models/item";

import config from "config";
import db from "./db/db";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/", routes);

const port = process.env.PORT || config.server.port;
app.listen(port);
console.log("Securing software project started: " + port);

module.exports = app;
