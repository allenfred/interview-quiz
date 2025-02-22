"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyUserRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let MyUserRepository = class MyUserRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userCredentialsRepositoryGetter) {
        super(models_1.User, dataSource);
        this.userCredentialsRepositoryGetter = userCredentialsRepositoryGetter;
        this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
        this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
    }
    async findCredentials(userId) {
        return this.userCredentials(userId)
            .get()
            .catch(err => {
            if (err.code === 'ENTITY_NOT_FOUND')
                return undefined;
            throw err;
        });
    }
};
exports.MyUserRepository = MyUserRepository;
exports.MyUserRepository = MyUserRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.mongodb')),
    tslib_1.__param(1, repository_1.repository.getter('UserCredentialsRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongodbDataSource, Function])
], MyUserRepository);
//# sourceMappingURL=user.repository.js.map