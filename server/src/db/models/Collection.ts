import mongoose, { Schema } from "mongoose";
import { folderSchema } from "./Folder";

export const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  schema: {
    type: String,
    required: true,
    trim: true,
  },
  _exporter_id: {
    type: Number,
    required: true,
    trim: true,
  },
});

collectionSchema.virtual("item", {
  ref: "Folder",
  localField: "_id",
  foreignField: "collection_id",
});

export const Collection = mongoose.model("Collection", collectionSchema);
