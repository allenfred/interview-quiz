import { DefaultCrudRepository } from '@loopback/repository';
import { MongodbDataSource } from '../datasources';
import { Reservation, ReservationRelations } from '../models';
export declare class ReservationRepository extends DefaultCrudRepository<Reservation, typeof Reservation.prototype.id, ReservationRelations> {
    constructor(dataSource: MongodbDataSource);
}
