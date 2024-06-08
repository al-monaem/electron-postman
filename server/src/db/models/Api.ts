import mongoose, { Schema } from "mongoose";

export const ApiRequestBodySchema = new Schema({
  mode: {
    type: String,
    required: true,
  },
  raw: {
    type: String,
    required: false,
    trim: true,
  },
  options: {
    type: Object,
    required: false,
    trim: true,
  },
});

export const ApiQuerySchema = new Schema({
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    trim: true,
  },
});

export const ApiRequestUrlSchema = new Schema({
  raw: {
    type: String,
    required: false,
    trim: true,
  },
  protocol: {
    type: String,
    required: false,
    trim: true,
  },
  host: {
    type: [String],
    required: false,
    trim: true,
  },
  port: {
    type: Number,
    required: false,
    trim: true,
  },
  path: {
    type: [String],
    required: false,
    trim: true,
  },
  query: {
    type: [ApiQuerySchema],
    required: false,
    trim: true,
  },
});

export const RequestSchema = new Schema({
  method: {
    type: String,
    required: true,
  },
  header: {
    type: Array,
    required: false,
    default: [],
  },
  body: {
    type: ApiRequestBodySchema,
    required: false,
  },
  url: {
    type: ApiRequestUrlSchema,
    required: false,
  },
});

export const ResponseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  originalRequest: {
    type: RequestSchema,
    required: true,
  },
  header: {
    type: [Object],
    required: false,
    default: [],
  },
  body: {
    type: String,
    required: false,
    trim: true,
  },
  code: {
    type: Number,
    required: true,
    default: 200,
  },
});

export const ApiSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  request: {
    type: RequestSchema,
    required: true,
  },
  response: {
    type: [ResponseSchema],
    required: true,
  },
  folder_id: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  collection_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export const Api = mongoose.model("Api", ApiSchema);
