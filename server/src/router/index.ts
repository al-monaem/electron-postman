import express from 'express';
import mockRoute from './routes/mock.route';
import publicRoute from './routes/public.route';

const router = express.Router();

export default (): express.Router => {
  mockRoute(router);
  publicRoute(router);

  return router;
};
