"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.createFolder = void 0;
const models_1 = require("../db/models");
const Folder_1 = require("../db/models/Folder");
const createFolder = async (req, res) => {
    try {
        const { name, description, collection_id } = req.body;
        const folder = new Folder_1.Folder({
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
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.createFolder = createFolder;
const deleteFolder = async (req, res) => {
    try {
        const { folder_id } = req.params;
        const folder = await Folder_1.Folder.findById(folder_id);
        if (!folder)
            throw new Error("Folder not found");
        await models_1.Api.deleteMany({
            folder_id: folder_id,
        });
        await folder.deleteOne();
        return res.status(201).json({
            message: "Folder deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.deleteFolder = deleteFolder;
//# sourceMappingURL=folder.controller.js.map