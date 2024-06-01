import { createApi, createExample } from "@controllers/api.controller";
import { createFolder } from "@controllers/folder.controller";
import {
  createCollection,
  getCollections,
} from "controllers/collection.controller";
import express from "express";

// router.route("/login").post(login);

export default (router: express.Router): express.Router => {
  router.route("/app/collection").post(createCollection);
  router.route("/app/collections").get(getCollections);

  router.route("/app/folder").post(createFolder);

  router.route("/app/api").post(createApi);

  router.route("/app/api/example").post(createExample);

  return router;
};
