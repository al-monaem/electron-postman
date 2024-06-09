"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMockRequest = void 0;
const models_1 = require("../db/models");
const fast_xml_parser_1 = require("fast-xml-parser");
const lodash_1 = __importDefault(require("lodash"));
const handleMockRequest = async (req, res) => {
    try {
        const { params } = req;
        const collection_id = params.collection_id;
        const collection = await models_1.Collection.findById(collection_id);
        if (!collection) {
            return res.status(404).json({ message: "Invalid Mock Server URL" });
        }
        const apis = await models_1.Api.find({ collection_id });
        for (const api of apis) {
            const response = validateApi(api, req);
            if (response) {
                const contentType = response.header.find((header) => header.key.toLowerCase() === "content-type")?.value || "application/json";
                res.set("content-type", contentType);
                return res
                    .status(response.code || 200)
                    .json(contentType === "application/json"
                    ? JSON.parse(response.body)
                    : response.body);
            }
        }
        return res.status(600).json({
            message: "No mock example found with the given parameters",
            code: 600,
        });
    }
    catch (error) {
        return res.status(600).json({
            message: error.message,
            code: 600,
        });
    }
};
exports.handleMockRequest = handleMockRequest;
const validateApi = (api, req) => {
    try {
        for (const response of api.response) {
            const apiUrl = new URL(response.originalRequest.url.raw);
            const payload = {
                path: apiUrl.pathname,
                header: response.header,
                body: response.originalRequest.body.raw,
                method: response.originalRequest.method,
            };
            if (payload.method !== req.method) {
                continue;
            }
            const path = req.originalUrl.split("?")[0];
            if (path !== payload.path) {
                continue;
            }
            const apiQuery = response.originalRequest.url.raw?.split("?", 2)[1];
            let apiQueryObject = {};
            if (apiQuery) {
                apiQueryObject = Object.fromEntries(apiQuery.split("&").map((query) => query.split("=")));
            }
            if (!lodash_1.default.isEqual(convertKeysToLowerCase(apiQueryObject), convertKeysToLowerCase(req.query))) {
                continue;
            }
            if (req.method === "POST" || req.method === "PUT") {
                if (req.headers["content-type"].includes("application/json")) {
                    try {
                        if (!lodash_1.default.isEqual(convertKeysToLowerCase(req.body), convertKeysToLowerCase(JSON.parse(payload.body)))) {
                            continue;
                        }
                    }
                    catch (error) {
                        console.log(error);
                        continue;
                    }
                }
                else if (req.headers["content-type"].includes("application/xml")) {
                    try {
                        if (payload.body.length &&
                            !(fast_xml_parser_1.XMLValidator.validate(payload.body) === true)) {
                            continue;
                        }
                        if (!lodash_1.default.isEqual(convertKeysToLowerCase(req.body), convertKeysToLowerCase(new fast_xml_parser_1.XMLParser().parse(payload.body)))) {
                            continue;
                        }
                    }
                    catch (error) {
                        console.log(error);
                        continue;
                    }
                }
                else {
                    if (req.body !== payload.body) {
                        continue;
                    }
                }
            }
            return response;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
function convertKeysToLowerCase(obj) {
    return lodash_1.default.reduce(obj, (result, value, key) => {
        result[key?.toLowerCase()] = value;
        return result;
    }, {});
}
//# sourceMappingURL=mock.controller.js.map