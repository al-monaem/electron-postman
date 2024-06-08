import { Folder, Collection, Api, UserCollection } from "db/models";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getCollections = async (req: any, res: Response) => {
  try {
    const user_collections = await UserCollection.find({
      user_id: mongoose.Types.ObjectId.createFromHexString(req.user_id),
    }).lean();

    const col_ids = user_collections.map((col) => col.collection_id);

    const collections: any = await Collection.find({
      _id: {
        $in: col_ids,
      },
    }).lean();

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

    const folders: any = [];
    const apis: any = [];

    for (const collection_id of col_ids) {
      const _folders = await Folder.find({ collection_id }).lean();
      folders.push(..._folders);
      const _apis = await Api.find({ collection_id }).lean();
      apis.push(..._apis);
    }

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

export const createCollection = async (req: any, res: Response) => {
  try {
    const { name, description, schema, _exporter_id } = req.body;

    const collection = new Collection({
      _exporter_id,
      description,
      name,
      schema,
    });

    await collection.save();

    await UserCollection.create({
      collection_id: collection._id,
      user_id: req["user_id"],
    });

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

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { collection_id } = req.params;

    const collection = await Collection.findById(collection_id);
    if (!collection) throw new Error("Collection not found");

    await Folder.deleteMany({
      collection_id: collection._id,
    });
    await Api.deleteMany({
      collection_id: collection._id,
    });
    await collection.deleteOne();

    return res.status(201).json({
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};
