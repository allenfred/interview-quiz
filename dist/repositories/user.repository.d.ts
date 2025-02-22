import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { MongodbDataSource } from '../datasources';
import { User, UserCredentials, UserRelations } from '../models';
import { MyUserCredentialsRepository } from './user-credentials.repository';
export declare class MyUserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
    protected userCredentialsRepositoryGetter: Getter<MyUserCredentialsRepository>;
    readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;
    constructor(dataSource: MongodbDataSource, userCredentialsRepositoryGetter: Getter<MyUserCredentialsRepository>);
    findCredentials(userId: typeof User.prototype.id): Promise<UserCredentials | undefined>;
}
