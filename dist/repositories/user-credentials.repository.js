"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyUserCredentialsRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
let MyUserCredentialsRepository = class MyUserCredentialsRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.UserCredentials, dataSource);
    }
};
exports.MyUserCredentialsRepository = MyUserCredentialsRepository;
exports.MyUserCredentialsRepository = MyUserCredentialsRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.mongodb')),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], MyUserCredentialsRepository);
//# sourceMappingURL=user-credentials.repository.js.map