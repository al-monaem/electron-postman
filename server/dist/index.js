"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const config_1 = __importDefault(require("./db/config"));
const router_1 = __importDefault(require("./router"));
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
(0, dotenv_1.configDotenv)();
(0, config_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    allowedHeaders: "*",
}));
app.use(bodyParser.json({
    limit: "1mb",
}));
app.use(bodyParser.xml({
    limit: "1mb",
}));
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send("Request payload mismatch with content-type");
    }
    else {
        next();
    }
});
app.use("/api/v1", (0, router_1.default)());
const server = http_1.default.createServer(app);
server.listen(process.env.APP_PORT || 3002, () => {
    console.log("listening on port " + process.env.APP_PORT);
});
//# sourceMappingURL=index.js.map