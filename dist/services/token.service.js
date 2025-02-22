"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyTokenService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
let MyTokenService = class MyTokenService {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async verifyToken(token) {
        try {
            const decoded = await this.tokenService.verifyToken(token);
            console.log('decoded', decoded);
            return {
                [security_1.securityId]: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                roles: decoded.roles,
            };
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
};
exports.MyTokenService = MyTokenService;
exports.MyTokenService = MyTokenService = tslib_1.__decorate([
    (0, core_1.injectable)(),
    tslib_1.__param(0, (0, core_1.inject)('services.TokenService')),
    tslib_1.__metadata("design:paramtypes", [Object])
], MyTokenService);
//# sourceMappingURL=token.service.js.map