import { Api, Collection } from 'db/models';
import { Request, Response, response } from 'express';

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
        return res.status(200).json(response);
      }
    }

    return res
      .status(404)
      .json({ message: 'No mock example found with the given parameters' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const validateApi = (api: any, req: Request): any => {
  try {
    const apiUrl = new URL(api.request.url.raw);
    const payload = {
      path: apiUrl.pathname,
      headers: api.request.header,
      body: api.request.body.raw,
      method: api.request.method,
    };

    if (payload.method !== req.method) {
      return null;
    }

    const path = req.originalUrl.split('?')[0];

    if (path !== payload.path) {
      return null;
    }

    console.log(api.request.url.raw);

    const apiQuery = api.request.url.raw?.split('?', 2)[1];
    console.log(apiQuery);

    if (apiQuery) {
      const apiQueryObject = Object.fromEntries(
        apiQuery.split('&').map((query: any) => query.split('='))
      );

      console.log(apiQueryObject);
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
