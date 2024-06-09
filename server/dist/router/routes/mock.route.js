"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRoute = void 0;
const api_controller_1 = require("../../controllers/api.controller");
const folder_controller_1 = require("../../controllers/folder.controller");
const collection_controller_1 = require("../../controllers/collection.controller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const mockRoute = () => {
    const router = express_1.default.Router();
    router.use(auth_middleware_1.verifyJWT);
    router.route("/collection").post(collection_controller_1.createCollection);
    router.route("/collections").get(collection_controller_1.getCollections);
    router.route("/collection/:collection_id").delete(collection_controller_1.deleteCollection);
    router.route("/folder").post(folder_controller_1.createFolder);
    router.route("/folder/:folder_id").delete(folder_controller_1.deleteFolder);
    router.route("/api").post(api_controller_1.createApi);
    router.route("/api").put(api_controller_1.updateApi);
    router.route("/api/:api_id").delete(api_controller_1.deleteRequest);
    router.route("/api/example").post(api_controller_1.createExample);
    router.route("/api/example").put(api_controller_1.updateExample);
    router.route("/api/example/:api_id/:example_id").delete(api_controller_1.deleteExample);
    return router;
};
exports.mockRoute = mockRoute;
//# sourceMappingURL=mock.route.js.map