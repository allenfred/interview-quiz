"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyUserService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const bcryptjs_1 = require("bcryptjs");
const repositories_1 = require("../repositories");
const keys_1 = require("../keys");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
let MyUserService = class MyUserService {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async verifyCredentials(credentials) {
        const invalidCredentialsError = 'Invalid email or password.';
        const foundUser = await this.userRepository.findOne({
            where: { email: credentials.email },
        });
        if (!foundUser) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        const credentialsFound = await this.userRepository.findCredentials(foundUser.id);
        if (!credentialsFound) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        const passwordMatched = await (0, bcryptjs_1.compare)(credentials.password, credentialsFound.password);
        console.log(credentials.password, credentialsFound.password, passwordMatched);
        if (!passwordMatched) {
            throw new rest_1.HttpErrors.Unauthorized(invalidCredentialsError);
        }
        return foundUser;
    }
    convertToUserProfile(user) {
        return {
            [security_1.securityId]: user.id.toString(),
            name: user.name,
            id: user.id,
            email: user.email,
            role: user.role,
            phone: user.phone,
        };
    }
    async createUser(userWithPassword) {
        const password = await this.passwordHasher.hashPassword(userWithPassword.password);
        console.log('password', password);
        userWithPassword.password = password;
        const user = await this.userRepository.create(lodash_1.default.omit(userWithPassword, 'password'));
        user.id = user.id.toString();
        await this.userRepository.userCredentials(user.id).create({ password });
        return user;
    }
    // function to find user by id
    async findUserById(id) {
        const userNotfound = 'invalid User';
        const foundUser = await this.userRepository.findOne({
            where: { id: id },
        });
        if (!foundUser) {
            throw new rest_1.HttpErrors.Unauthorized(userNotfound);
        }
        return foundUser;
    }
};
exports.MyUserService = MyUserService;
exports.MyUserService = MyUserService = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.MyUserRepository)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MyUserRepository, Object])
], MyUserService);
//# sourceMappingURL=user.service.js.map