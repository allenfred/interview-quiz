"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = exports.hashPassword = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = require("bcryptjs");
const bcryptjs_2 = require("bcryptjs");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
// bind function to `services.bcryptjs.HashPassword`
async function hashPassword(password, rounds) {
    const salt = await (0, bcryptjs_1.genSalt)(rounds);
    return (0, bcryptjs_1.hash)(password, salt);
}
exports.hashPassword = hashPassword;
let BcryptHasher = class BcryptHasher {
    constructor(rounds) {
        this.rounds = rounds;
    }
    async hashPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(this.rounds);
        return (0, bcryptjs_1.hash)(password, salt);
    }
    async comparePassword(providedPass, storedPass) {
        const passwordIsMatched = await (0, bcryptjs_2.compare)(providedPass, storedPass);
        return passwordIsMatched;
    }
};
exports.BcryptHasher = BcryptHasher;
exports.BcryptHasher = BcryptHasher = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.PasswordHasherBindings.ROUNDS)),
    tslib_1.__metadata("design:paramtypes", [Number])
], BcryptHasher);
//# sourceMappingURL=hash.password.bcryptjs.js.map