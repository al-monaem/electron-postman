import express from "express";
import mockRoute from "./routes/mock.route";

const router = express.Router();

export default (): express.Router => {
  mockRoute(router);

  return router;
};
