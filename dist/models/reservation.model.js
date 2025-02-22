"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_model_1 = require("./user.model");
let Reservation = class Reservation extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Reservation = Reservation;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        mongodb: { dataType: 'ObjectId' },
    }),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "guestName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "contactInfo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "expectedArrivalTime", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
        jsonSchema: {
            enum: [1, 2, 3],
        },
    }),
    tslib_1.__metadata("design:type", Number)
], Reservation.prototype, "tableSize", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
        jsonSchema: {
            enum: ['confirmed', 'canceled', 'completed'],
        },
        default: 'confirmed',
    }),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.belongsTo)(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], Reservation.prototype, "userId", void 0);
exports.Reservation = Reservation = tslib_1.__decorate([
    (0, repository_1.model)({
        settings: {
            strictObjectIDCoercion: true,
            mongodb: { collection: 'reservations' },
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Reservation);
//# sourceMappingURL=reservation.model.js.map