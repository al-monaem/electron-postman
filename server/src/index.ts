import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import dbconnect from './db/config';
import router from './router';

configDotenv();
dbconnect();

const app = express();

app.use(
  cors({
    origin: '*',
    allowedHeaders: '*',
  })
);

app.use(
  bodyParser.json({
    limit: '1mb',
  })
);

app.use('/api/v1', router());

const server = http.createServer(app);

server.listen(process.env.APP_PORT || 3002, () => {
  console.log('listening on port ' + process.env.APP_PORT);
});
