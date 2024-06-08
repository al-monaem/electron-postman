import { handleMockRequest } from "@controllers/mock.controller";
import { login, register } from "@controllers/user.controller";
import express from "express";

export default (router: express.Router): express.Router => {
  router.route("/auth/login").post(login);
  router.route("/auth/register").post(register);

  router.route("/:collection_id").all(handleMockRequest);
  router.route("/:collection_id/*").all(handleMockRequest);

  return router;
};
