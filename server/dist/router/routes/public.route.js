"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_controller_1 = require("../../controllers/mock.controller");
const user_controller_1 = require("../../controllers/user.controller");
exports.default = (router) => {
    router.route("/auth/login").post(user_controller_1.login);
    router.route("/auth/register").post(user_controller_1.register);
    router.route("/:collection_id").all(mock_controller_1.handleMockRequest);
    router.route("/:collection_id/*").all(mock_controller_1.handleMockRequest);
    return router;
};
//# sourceMappingURL=public.route.js.map