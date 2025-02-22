import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { UserCredentials, UserCredentialsRelations } from '../models';
export declare class MyUserCredentialsRepository extends DefaultCrudRepository<UserCredentials, typeof UserCredentials.prototype.id, UserCredentialsRelations> {
    constructor(dataSource: juggler.DataSource);
}
