"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Employee = class Employee extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Employee = Employee;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        mongodb: { dataType: 'ObjectId' },
    }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "contactInfo", void 0);
exports.Employee = Employee = tslib_1.__decorate([
    (0, repository_1.model)({
        settings: {
            strictObjectIDCoercion: true,
            mongodb: { collection: 'employees' },
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Employee);
//# sourceMappingURL=employee.model.js.map