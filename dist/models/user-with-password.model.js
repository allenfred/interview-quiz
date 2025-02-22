"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithPassword = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_model_1 = require("./user.model");
let UserWithPassword = class UserWithPassword extends user_model_1.User {
};
exports.UserWithPassword = UserWithPassword;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserWithPassword.prototype, "password", void 0);
exports.UserWithPassword = UserWithPassword = tslib_1.__decorate([
    (0, repository_1.model)()
], UserWithPassword);
//# sourceMappingURL=user-with-password.model.js.map