"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const security_1 = require("@loopback/security");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const logging_1 = require("@loopback/logging");
let ReservationController = class ReservationController {
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async create(user, reservation) {
        return this.reservationRepository.create({
            ...reservation,
            contactInfo: user.name,
        });
    }
    async find(user) {
        let filter = {};
        if (user.role === 'guest') {
            filter = { where: { userId: user.id } };
        }
        return this.reservationRepository.find(filter);
    }
    async findById(id) {
        return this.reservationRepository.findById(id);
    }
    async updateById(id, reservation) {
        try {
            await this.reservationRepository.updateById(id, reservation);
        }
        catch (e) {
            this.logger.error('Error updating reservation:', e);
        }
    }
};
exports.ReservationController = ReservationController;
tslib_1.__decorate([
    (0, core_1.inject)(logging_1.LoggingBindings.WINSTON_LOGGER),
    tslib_1.__metadata("design:type", logging_1.WinstonLogger)
], ReservationController.prototype, "logger", void 0);
tslib_1.__decorate([
    (0, rest_1.post)('/reservations'),
    (0, rest_1.response)(200, {
        description: 'Reservation model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Reservation) } },
    }),
    (0, authorization_1.authorize)({ allowedRoles: ['guest'] }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Reservation, {
                    title: 'NewReservation',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReservationController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/reservations'),
    (0, rest_1.response)(200, {
        description: 'Array of Reservation model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Reservation, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReservationController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/reservations/{id}'),
    (0, rest_1.response)(200, {
        description: 'Reservation model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Reservation, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReservationController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/reservations/{id}'),
    (0, rest_1.response)(204, {
        description: 'Reservation PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Reservation, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Reservation]),
    tslib_1.__metadata("design:returntype", Promise)
], ReservationController.prototype, "updateById", null);
exports.ReservationController = ReservationController = tslib_1.__decorate([
    (0, rest_1.api)({ basePath: '/api' }),
    (0, authentication_1.authenticate)('jwt'),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ReservationRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ReservationRepository])
], ReservationController);
//# sourceMappingURL=reservation.controller.js.map