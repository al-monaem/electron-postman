"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.deleteExample = exports.updateExample = exports.updateApi = exports.createExample = exports.createApi = void 0;
const models_1 = require("../db/models");
const fast_xml_parser_1 = require("fast-xml-parser");
const createApi = async (req, res) => {
    try {
        const { collection_id, name, folder_id, request, defaultStatusCode, response, } = req.body;
        const collection = await models_1.Collection.findById(collection_id);
        if (!collection)
            throw new Error("Collection not found");
        if (folder_id) {
            const folder = await models_1.Folder.findById(folder_id);
            if (!folder)
                throw new Error("Folder not found");
        }
        const existApi = await models_1.Api.findOne({
            name: name,
            collection_id: collection._id,
        }).lean();
        if (existApi)
            throw new Error("Duplicate API name under same collection");
        const url = `${request.url?.raw}?${(request.url.query || [])
            .filter((query) => !query.disabled)
            .map((query) => `${query.key}=${query.value}`)
            .join("&")}`;
        const parsedURL = validateAPI(url, request, response);
        let apiUrlRaw = request.url.raw.split("?", 2)[0];
        if (request.url.query?.length > 0) {
            apiUrlRaw = `${request.url.raw}?${(request.url.query || [])
                .filter((query) => !query.disabled)
                .map((query) => `${query.key}=${query.value}`)
                .join("&")}`;
        }
        const apiBody = {
            mode: request.body?.mode,
            raw: request.body.raw || "",
            options: request.body?.options,
        };
        const apiUrl = {
            raw: apiUrlRaw,
            protocol: parsedURL.protocol,
            port: parsedURL.port,
            host: parsedURL.hostname.split("."),
            path: parsedURL.pathname.split("/"),
            query: request.url.query || [],
        };
        const apiRequest = {
            method: request.method,
            url: apiUrl,
            header: [
                {
                    key: "Content-Type",
                    value: request.mode === "raw" && request?.options?.raw?.language === "xml"
                        ? "application/xml"
                        : "application/json",
                    name: "Content-Type",
                    description: "",
                    type: "text",
                },
            ],
            body: apiBody,
        };
        const apiResponse = [
            {
                name,
                originalRequest: apiRequest,
                header: [
                    {
                        key: "Content-Type",
                        value: request.mode === "raw" &&
                            request?.options?.raw?.language === "xml"
                            ? "application/xml"
                            : "application/json",
                        name: "Content-Type",
                        description: "",
                        type: "text",
                    },
                ],
                code: defaultStatusCode || 200,
                body: response.body,
            },
        ];
        const api = new models_1.Api({
            name,
            collection_id,
            folder_id,
            request: apiRequest,
            response: apiResponse,
        });
        await api.save();
        return res.status(201).json({
            api: api,
            message: "Api saved successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message,
        });
    }
};
exports.createApi = createApi;
const createExample = async (req, res) => {
    try {
        const { request, response, _id } = req.body;
        const api = await models_1.Api.findById(_id);
        if (!api)
            throw new Error(`Could not find API`);
        const url = `${request.url?.raw}?${(request.url.query || [])
            .filter((query) => !query.disabled)
            .map((query) => `${query.key}=${query.value}`)
            .join("&")}`;
        const parsedURL = validateAPI(url, request, response);
        const apiBody = {
            mode: request.body?.mode,
            raw: request.body.raw || "",
            options: request.body?.options,
        };
        let apiUrlRaw = request.url.raw.split("?", 2)[0];
        if (request.url.query.length > 0) {
            apiUrlRaw = `${request.url.raw}?${(request.url.query || [])
                .filter((query) => !query.disabled)
                .map((query) => `${query.key}=${query.value}`)
                .join("&")}`;
        }
        const apiUrl = {
            raw: apiUrlRaw,
            protocol: parsedURL.protocol,
            port: parsedURL.port,
            host: parsedURL.hostname.split("."),
            path: parsedURL.pathname.split("/"),
            query: request.url.query,
        };
        const apiRequest = {
            method: request.method,
            url: apiUrl,
            header: request.header,
            body: apiBody,
        };
        const apiResponse = {
            name: response.name,
            originalRequest: apiRequest,
            header: [
                {
                    key: "Content-Type",
                    value: request.mode === "xml" ? "application/xml" : "application/json",
                    name: "Content-Type",
                    description: "",
                    type: "text",
                },
            ],
            code: response.code || 200,
            body: response.body,
        };
        if (api.response.find((r) => r.name === apiResponse.name))
            throw new Error("Duplicate example name within same api");
        api.response.push(apiResponse);
        await api.save();
        return res.status(201).json(api);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.createExample = createExample;
const updateApi = async (req, res) => {
    try {
        const { request, response, _id, name } = req.body;
        const api = await models_1.Api.findById(_id);
        if (!api)
            throw new Error(`Could not find API`);
        const url = `${request.url?.raw}?${(request.url.query || [])
            .filter((query) => !query.disabled)
            .map((query) => `${query.key}=${query.value}`)
            .join("&")}`;
        const duplicateName = await models_1.Api.findOne({
            _id: {
                $ne: api._id,
            },
            collection_id: api.collection_id,
            name: name,
        });
        if (duplicateName)
            throw new Error("Another name already exists in this collection");
        const parsedURL = validateAPI(url, request, response);
        const apiBody = {
            mode: request.body?.mode,
            raw: request.body.raw || "",
            options: request.body?.options,
        };
        let apiUrlRaw = request.url.raw.split("?", 2)[0];
        if (request.url.query.length > 0) {
            apiUrlRaw = `${request.url.raw}?${(request.url.query || [])
                .filter((query) => !query.disabled)
                .map((query) => `${query.key}=${query.value}`)
                .join("&")}`;
        }
        const apiUrl = {
            raw: apiUrlRaw,
            protocol: parsedURL.protocol,
            port: parsedURL.port,
            host: parsedURL.hostname.split("."),
            path: parsedURL.pathname.split("/"),
            query: request.url.query,
        };
        const apiRequest = {
            method: request.method,
            url: apiUrl,
            header: request.header,
            body: apiBody,
        };
        api.request = apiRequest;
        await api.save();
        return res.status(201).json(api);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.updateApi = updateApi;
const updateExample = async (req, res) => {
    try {
        const { request, response, _id, active_example_id } = req.body;
        const api = await models_1.Api.findById(_id);
        if (!api)
            throw new Error(`Could not find API`);
        const url = `${request.url?.raw}?${(request.url.query || [])
            .filter((query) => !query.disabled)
            .map((query) => `${query.key}=${query.value}`)
            .join("&")}`;
        const parsedURL = validateAPI(url, request, response);
        const example = api.response.find((r) => r._id.toString() === active_example_id);
        if (!example)
            throw new Error("Could not find example");
        let apiUrlRaw = request.url.raw.split("?", 2)[0];
        if (request.url.query.length > 0) {
            apiUrlRaw = `${request.url.raw}?${(request.url.query || [])
                .filter((query) => !query.disabled)
                .map((query) => `${query.key}=${query.value}`)
                .join("&")}`;
        }
        const apiUrl = {
            raw: apiUrlRaw,
            protocol: parsedURL.protocol,
            port: parsedURL.port,
            host: parsedURL.hostname.split("."),
            path: parsedURL.pathname.split("/"),
            query: request.url.query,
        };
        const apiRequest = {
            method: request.method,
            url: apiUrl,
            header: request.header,
            body: request.body,
        };
        if (api.response.find((r) => r.name === response.name && r._id !== example._id))
            throw new Error("Duplicate example name within same api");
        example.name = response.name;
        example.body = response.body;
        example.code = response.code;
        example.header = request.header;
        // keep only unique header keys
        example.header = example.header.filter((header, index, self) => index === self.findIndex((t) => t.key === header.key));
        const conentTypeHeader = example.header.find((header) => header.key === "Content-Type");
        if (!conentTypeHeader) {
            example.header.push({
                key: "Content-Type",
                value: request.mode === "xml" ? "application/xml" : "application/json",
                name: "Content-Type",
                description: "",
                type: "text",
            });
        }
        example.originalRequest = apiRequest;
        await api.save();
        const _api = await models_1.Api.findById(_id).lean();
        return res.status(201).json({
            ..._api,
            response: example,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.updateExample = updateExample;
const validateAPI = (url, request, response) => {
    let parsedURL;
    try {
        parsedURL = new URL(url);
    }
    catch (error) {
        throw new Error("Malformed URL: " + url);
    }
    if (request.body.mode === "raw") {
        if (request.body.options.raw?.language === "json") {
            try {
                if (request.body.raw)
                    JSON.parse(request.body.raw);
            }
            catch (error) {
                throw new Error("Malformed Request body json");
            }
            try {
                if (response.body)
                    JSON.parse(response.body);
            }
            catch (error) {
                throw new Error("Malformed Response body json");
            }
        }
        if (request.body.options.raw?.language === "xml") {
            try {
                const validXML = fast_xml_parser_1.XMLValidator.validate(request.body.raw);
                if (!validXML)
                    throw new Error("Malformed Request body xml");
            }
            catch (error) {
                throw new Error("Malformed Response body xml");
            }
            try {
                const validXML = fast_xml_parser_1.XMLValidator.validate(response.body || "");
                if (!validXML)
                    throw new Error("Malformed Response body xml");
            }
            catch (error) {
                throw new Error("Malformed Response body xml");
            }
        }
    }
    else {
        try {
            if (response.body)
                JSON.parse(response.body);
        }
        catch (error) {
            throw new Error("Malformed Response body json");
        }
    }
    return parsedURL;
};
const deleteExample = async (req, res) => {
    try {
        const { api_id, example_id } = req.params;
        const api = await models_1.Api.findById(api_id);
        if (!api)
            throw new Error(`Api not found`);
        if (api.response.length === 0)
            return res.status(201).json({
                message: "Example deleted successfully",
            });
        let i = 0;
        for (; i < api.response.length; i++) {
            if (api.response[i]._id.toString() === example_id) {
                break;
            }
        }
        if (i > api.response.length)
            throw new Error("Example not found under this api");
        api.response.splice(i, 1);
        await api.save();
        return res.status(201).json({
            message: "Example deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.deleteExample = deleteExample;
const deleteRequest = async (req, res) => {
    try {
        const { api_id, example_id } = req.params;
        const api = await models_1.Api.findById(api_id);
        if (!api)
            throw new Error(`Request not found`);
        await models_1.Api.deleteOne({
            _id: api._id,
        });
        return res.status(201).json({
            message: "Request deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};
exports.deleteRequest = deleteRequest;
//# sourceMappingURL=api.controller.js.map