import { handleMockRequest } from '@controllers/mock.controller';
import express from 'express';

export default (router: express.Router): express.Router => {
  router.route('/:collection_id').all(handleMockRequest);
  router.route('/:collection_id/*').all(handleMockRequest);

  return router;
};
