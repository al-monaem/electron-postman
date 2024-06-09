"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const public_route_1 = __importDefault(require("./routes/public.route"));
const mock_route_1 = require("./routes/mock.route");
exports.default = () => {
    const router = express_1.default.Router();
    router.use("/app", (0, mock_route_1.mockRoute)());
    (0, public_route_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map