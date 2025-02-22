import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class MongodbDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        url: string;
        database: string;
        useNewUrlParser: boolean;
        strictObjectIDCoercion: boolean;
    };
    constructor(dsConfig?: object);
}
