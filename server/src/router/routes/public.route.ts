import { handleMockRequest } from '@controllers/mock.controller';
import express from 'express';

const router = express.Router();

// router.route("/registerUser").post(registerUser);
// router.route("/login").post(login);

export default (router: express.Router): express.Router => {
  router.all('/:collection_id', handleMockRequest);
  router.all('/:collection_id/*', handleMockRequest);

  return router;
};
