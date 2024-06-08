import {
  createApi,
  createExample,
  deleteExample,
  deleteRequest,
  updateApi,
  updateExample,
} from "@controllers/api.controller";
import { createFolder, deleteFolder } from "@controllers/folder.controller";
import {
  createCollection,
  deleteCollection,
  getCollections,
} from "controllers/collection.controller";
import express from "express";
import { verifyJWT } from "middleware/auth.middleware";

export const mockRoute = (): express.Router => {
  const router = express.Router();
  router.use(verifyJWT);

  router.route("/collection").post(createCollection);
  router.route("/collections").get(getCollections);
  router.route("/collection/:collection_id").delete(deleteCollection);

  router.route("/folder").post(createFolder);
  router.route("/folder/:folder_id").delete(deleteFolder);

  router.route("/api").post(createApi);
  router.route("/api").put(updateApi);
  router.route("/api/:api_id").delete(deleteRequest);

  router.route("/api/example").post(createExample);
  router.route("/api/example").put(updateExample);
  router.route("/api/example/:api_id/:example_id").delete(deleteExample);

  return router;
};
