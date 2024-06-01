import { Folder, Collection, Api } from "db/models";
import { Request, Response } from "express";

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections: any = await Collection.find().lean();

    for (const collection of collections) {
      const folders: any = await Folder.find({
        collection_id: collection._id,
      }).lean();

      for (const folder of folders) {
        const apis: any = await Api.find({
          folder_id: folder._id,
          collection_id: collection._id,
        }).lean();

        folder.item = apis;
      }

      const apis = await Api.find({
        collection_id: collection._id,
        folder_id: null,
      }).lean();

      collection.item = [...folders, ...apis];
    }

    const folders = await Folder.find().lean();
    const apis = await Api.find().lean();

    return res.status(200).json({
      collections,
      folders,
      apis,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { name, description, schema, _exporter_id } = req.body;

    const collection = new Collection({
      _exporter_id,
      description,
      name,
      schema,
    });

    await collection.save();

    return res.status(201).json({
      message: "Collection created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};
