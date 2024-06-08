import { Api } from "db/models";
import { Folder } from "db/models/Folder";
import { Request, Response } from "express";

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, description, collection_id } = req.body;

    const folder = new Folder({
      collection_id,
      description,
      name,
      item: [],
    });

    await folder.save();

    return res.status(201).json({
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { folder_id } = req.params;
    const folder = await Folder.findById(folder_id);

    if (!folder) throw new Error("Folder not found");

    await Api.deleteMany({
      folder_id: folder_id,
    });

    await folder.deleteOne();

    return res.status(201).json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};
