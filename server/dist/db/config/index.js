"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbconnect = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI, {
            dbName: 'mime_api',
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit();
    }
};
exports.default = dbconnect;
//# sourceMappingURL=index.js.map