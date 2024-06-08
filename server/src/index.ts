import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import dbconnect from "./db/config";
import router from "./router";
import { verifyJWT } from "middleware/auth.middleware";

const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);

configDotenv();
dbconnect();

const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

app.use(
  bodyParser.json({
    limit: "1mb",
  })
);
app.use(
  bodyParser.xml({
    limit: "1mb",
  })
);

app.use((err: any, req: Request, res: Response, next: any) => {
  if (err) {
    res.status(400).send("Request payload mismatch with content-type");
  } else {
    next();
  }
});

app.use("/api/v1", router());

const server = http.createServer(app);

server.listen(process.env.APP_PORT || 3002, () => {
  console.log("listening on port " + process.env.APP_PORT);
});
