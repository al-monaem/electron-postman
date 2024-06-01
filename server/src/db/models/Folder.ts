import mongoose, { Schema } from "mongoose";

export const folderSchema = new Schema({
  name: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  collection_id: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
});

export const Folder = mongoose.model("Folder", folderSchema);
