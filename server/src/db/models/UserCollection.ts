import mongoose, { Schema } from "mongoose";

export const UserCollectionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  collection_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Collection",
  },
});

export const UserCollection = mongoose.model(
  "UserCollection",
  UserCollectionSchema
);
