"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.ApiSchema = exports.ResponseSchema = exports.RequestSchema = exports.ApiRequestUrlSchema = exports.ApiQuerySchema = exports.ApiRequestBodySchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.ApiRequestBodySchema = new mongoose_1.Schema({
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
exports.ApiQuerySchema = new mongoose_1.Schema({
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
exports.ApiRequestUrlSchema = new mongoose_1.Schema({
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
        type: [exports.ApiQuerySchema],
        required: false,
        trim: true,
    },
});
exports.RequestSchema = new mongoose_1.Schema({
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
        type: exports.ApiRequestBodySchema,
        required: false,
    },
    url: {
        type: exports.ApiRequestUrlSchema,
        required: false,
    },
});
exports.ResponseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    originalRequest: {
        type: exports.RequestSchema,
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
exports.ApiSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    request: {
        type: exports.RequestSchema,
        required: true,
    },
    response: {
        type: [exports.ResponseSchema],
        required: true,
    },
    folder_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    collection_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
exports.Api = mongoose_1.default.model("Api", exports.ApiSchema);
//# sourceMappingURL=Api.js.map