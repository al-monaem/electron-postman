import { Api, Collection } from 'db/models';
import { Request, Response } from 'express';
import _ from 'lodash';

var parser = require('xml2json');

export const handleMockRequest = async (req: Request, res: Response) => {
  try {
    const { params } = req;

    const collection_id = params.collection_id;

    const collection = await Collection.findById(collection_id);

    if (!collection) {
      return res.status(404).json({ message: 'Invalid Mock Server URL' });
    }

    const apis = await Api.find({ collection_id });

    for (const api of apis) {
      const response = validateApi(api, req);
      if (response) {
        return res.status(response.code || 200).json(response.body);
      }
    }

    return res.status(600).json({
      message: 'No mock example found with the given parameters',
      code: 600,
    });
  } catch (error) {
    return res.status(600).json({
      message: error.message,
      code: 600,
    });
  }
};

const validateApi = (api: any, req: Request): any => {
  try {
    for (const response of api.response) {
      console.log(response);
      const apiUrl = new URL(response.originalRequest.url.raw);
      const payload = {
        path: apiUrl.pathname,
        headers: response.header,
        body: response.body,
        method: response.originalRequest.method,
      };

      if (payload.method !== req.method) {
        continue;
      }

      const path = req.originalUrl.split('?')[0];

      if (path !== payload.path) {
        continue;
      }

      const apiQuery = response.originalRequest.url.raw?.split('?', 2)[1];
      let apiQueryObject = {};

      if (apiQuery) {
        apiQueryObject = Object.fromEntries(
          apiQuery.split('&').map((query: any) => query.split('='))
        );
      }

      if (!_.isEqual(apiQueryObject, req.query)) {
        continue;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        if (req.headers['content-type'].includes('application/json')) {
          try {
            if (!_.isEqual(req.body, JSON.parse(payload.body))) {
              continue;
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        } else if (req.headers['content-type'].includes('application/xml')) {
          try {
            if (
              !_.isEqual(parser.toJson(req.body), parser.toJson(payload.body))
            ) {
              continue;
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        } else {
          if (req.body !== payload.body) {
            continue;
          }
        }
      }

      return response;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
