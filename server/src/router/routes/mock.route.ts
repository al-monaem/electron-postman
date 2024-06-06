import {
  createApi,
  createExample,
  updateApi,
  updateExample,
} from '@controllers/api.controller';
import { createFolder } from '@controllers/folder.controller';
import {
  createCollection,
  getCollections,
} from 'controllers/collection.controller';
import express from 'express';

export default (router: express.Router): express.Router => {
  router.route('/app/collection').post(createCollection);
  router.route('/app/collections').get(getCollections);

  router.route('/app/folder').post(createFolder);

  router.route('/app/api').post(createApi);
  router.route('/app/api').put(updateApi);

  router.route('/app/api/example').post(createExample);
  router.route('/app/api/example').put(updateExample);

  return router;
};
