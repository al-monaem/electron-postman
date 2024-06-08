import express from "express";
import publicRoute from "./routes/public.route";
import { mockRoute } from "./routes/mock.route";

export default (): express.Router => {
  const router = express.Router();

  router.use("/app", mockRoute());
  publicRoute(router);

  return router;
};
