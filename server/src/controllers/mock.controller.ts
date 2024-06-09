import { Api, Collection } from 'db/models';
import { Request, Response } from 'express';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import _ from 'lodash';

type GenericObject = { [key: string]: any };

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
        const contentType =
          response.header.find(
            (header: any) => header.key.toLowerCase() === 'content-type'
          )?.value || 'application/json';
        res.set('content-type', contentType);
        return res
          .status(response.code || 200)
          .json(
            contentType === 'application/json'
              ? JSON.parse(response.body)
              : response.body
          );
      }
    }

    for (const api of apis) {
      const response = validateApiWithKeyOnly(api, req);
      if (response) {
        const contentType =
          response.header.find(
            (header: any) => header.key.toLowerCase() === 'content-type'
          )?.value || 'application/json';
        res.set('content-type', contentType);
        return res
          .status(response.code || 200)
          .json(
            contentType === 'application/json'
              ? JSON.parse(response.body)
              : response.body
          );
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
      const apiUrl = new URL(response.originalRequest.url.raw);
      const payload = {
        path: apiUrl.pathname,
        header: response.header,
        body: response.originalRequest.body.raw,
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

      if (
        !_.isEqual(
          convertKeysToLowerCase(apiQueryObject),
          convertKeysToLowerCase(req.query)
        )
      ) {
        continue;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        if (req.headers['content-type'].includes('application/json')) {
          try {
            if (
              !_.isEqual(
                convertKeysToLowerCase(req.body),
                convertKeysToLowerCase(JSON.parse(payload.body))
              )
            ) {
              continue;
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        } else if (req.headers['content-type'].includes('application/xml')) {
          try {
            if (
              payload.body.length &&
              !(XMLValidator.validate(payload.body) === true)
            ) {
              continue;
            }
            if (
              !_.isEqual(
                convertKeysToLowerCase(req.body),
                convertKeysToLowerCase(new XMLParser().parse(payload.body))
              )
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

const validateApiWithKeyOnly = (api: any, req: Request): any => {
  try {
    for (const response of api.response) {
      const apiUrl = new URL(response.originalRequest.url.raw);
      const payload = {
        path: apiUrl.pathname,
        header: response.header,
        body: response.originalRequest.body.raw,
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

      if (
        !_.isEqual(
          Object.keys(convertKeysToLowerCase(apiQueryObject)),
          Object.keys(convertKeysToLowerCase(req.query))
        )
      ) {
        continue;
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        if (req.headers['content-type'].includes('application/json')) {
          try {
            if (
              !haveSameKeys(
                convertKeysToLowerCase(req.body),
                convertKeysToLowerCase(JSON.parse(payload.body))
              )
            ) {
              continue;
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        } else if (req.headers['content-type'].includes('application/xml')) {
          try {
            if (
              payload.body.length &&
              !(XMLValidator.validate(payload.body) === true)
            ) {
              continue;
            }
            if (
              !_.isEqual(
                convertKeysToLowerCase(req.body),
                convertKeysToLowerCase(new XMLParser().parse(payload.body))
              )
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

function convertKeysToLowerCase(obj: any) {
  return _.reduce(
    obj,
    (result: any, value, key: any) => {
      result[key?.toLowerCase()] = value;
      return result;
    },
    {}
  );
}

function haveSameKeys(object1: GenericObject, object2: GenericObject) {
  // Check if both are objects
  if (_.isObject(object1) && _.isObject(object2)) {
    // Get the keys of both objects
    const keys1 = _.keys(object1);
    const keys2 = _.keys(object2);

    // Compare keys
    if (!_.isEqual(keys1, keys2)) {
      return false;
    }

    // Recursively check nested objects
    for (const key of keys1) {
      if (!haveSameKeys(object1[key], object2[key])) {
        return false;
      }
    }

    return true;
  }

  return true;
}
