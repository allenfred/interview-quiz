"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.SignupRequestBody = exports.CredentialsRequestBody = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const rest_2 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const logging_1 = require("@loopback/logging");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const repository_1 = require("@loopback/repository");
const reservation_repository_1 = require("../repositories/reservation.repository");
const user_repository_1 = require("../repositories/user.repository");
const CredentialsSchema = {
    type: 'object',
    required: ['email', 'password', 'role'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 6,
        },
        role: {
            type: 'string',
            enum: ['employee', 'guest'],
        },
    },
};
exports.CredentialsRequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': { schema: CredentialsSchema },
    },
};
const SignupSchema = {
    type: 'object',
    required: ['name', 'email', 'password', 'phone', 'role'],
    properties: {
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 6,
        },
        phone: {
            type: 'string',
        },
        role: {
            type: 'string',
            enum: ['employee', 'guest'],
        },
    },
};
exports.SignupRequestBody = {
    description: 'The input of signup function',
    required: true,
    content: {
        'application/json': { schema: SignupSchema },
    },
};
let UserController = class UserController {
    constructor(jwtService, userService, user, userRepository, reservationRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.user = user;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
    }
    async login(credentials) {
        const user = await this.userService.verifyCredentials(credentials);
        const userProfile = this.userService.convertToUserProfile(user);
        const token = await this.jwtService.generateToken(userProfile);
        return { token };
    }
    async signup(newUserRequest) {
        return this.userService.createUser(newUserRequest);
    }
    async whoAmI(currentUserProfile) {
        return currentUserProfile;
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, core_1.inject)(logging_1.LoggingBindings.WINSTON_LOGGER),
    tslib_1.__metadata("design:type", logging_1.WinstonLogger)
], UserController.prototype, "logger", void 0);
tslib_1.__decorate([
    (0, rest_2.post)('/users/login', {
        responses: {
            '200': {
                description: 'Token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
        cors: true,
    }),
    tslib_1.__param(0, (0, rest_2.requestBody)(exports.CredentialsRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_2.post)('/users/signup', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                email: { type: 'string' },
                                phone: { type: 'string' },
                                role: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        cors: true,
    }),
    tslib_1.__param(0, (0, rest_2.requestBody)(exports.SignupRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_2.get)('/whoAmI', {
        responses: {
            '200': {
                description: '',
                schema: {
                    type: 'string',
                },
            },
        },
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "whoAmI", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, rest_1.api)({ basePath: '/api' }),
    tslib_1.__param(0, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(2, (0, core_1.inject)(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(3, (0, repository_1.repository)(user_repository_1.MyUserRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(reservation_repository_1.ReservationRepository)),
    tslib_1.__metadata("design:paramtypes", [Object, authentication_jwt_1.MyUserService, Object, user_repository_1.MyUserRepository,
        reservation_repository_1.ReservationRepository])
], UserController);
//# sourceMappingURL=user.controller.js.map