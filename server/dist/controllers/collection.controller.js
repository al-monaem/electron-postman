"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.createCollection = exports.getCollections = void 0;
const models_1 = require("../db/models");
const mongoose_1 = __importDefault(require("mongoose"));
const getCollections = async (req, res) => {
    try {
        const user_collections = await models_1.UserCollection.find({
            user_id: mongoose_1.default.Types.ObjectId.createFromHexString(req.user_id),
        }).lean();
        const col_ids = user_collections.map((col) => col.collection_id);
        const collections = await models_1.Collection.find({
            _id: {
                $in: col_ids,
            },
        }).lean();
        for (const collection of collections) {
            const folders = await models_1.Folder.find({
                collection_id: collection._id,
            }).lean();
            for (const folder of folders) {
                const apis = await models_1.Api.find({
                    folder_id: folder._id,
                    collection_id: collection._id,
                }).lean();
                folder.item = apis;
            }
            const apis = await models_1.Api.find({
                collection_id: collection._id,
                folder_id: null,
            }).lean();
            collection.item = [...folders, ...apis];
        }
        const folders = [];
        const apis = [];
        for (const collection_id of col_ids) {
            const _folders = await models_1.Folder.find({ collection_id }).lean();
            folders.push(..._folders);
            const _apis = await models_1.Api.find({ collection_id }).lean();
            apis.push(..._apis);
        }
        return res.status(200).json({
            collections,
            folders,
            apis,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.getCollections = getCollections;
const createCollection = async (req, res) => {
    try {
        const { name, description, schema, _exporter_id } = req.body;
        const collection = new models_1.Collection({
            _exporter_id,
            description,
            name,
            schema,
        });
        await collection.save();
        await models_1.UserCollection.create({
            collection_id: collection._id,
            user_id: req["user_id"],
        });
        return res.status(201).json({
            message: "Collection created successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.createCollection = createCollection;
const deleteCollection = async (req, res) => {
    try {
        const { collection_id } = req.params;
        const collection = await models_1.Collection.findById(collection_id);
        if (!collection)
            throw new Error("Collection not found");
        await models_1.Folder.deleteMany({
            collection_id: collection._id,
        });
        await models_1.Api.deleteMany({
            collection_id: collection._id,
        });
        await collection.deleteOne();
        return res.status(201).json({
            message: "Collection deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.deleteCollection = deleteCollection;
//# sourceMappingURL=collection.controller.js.map