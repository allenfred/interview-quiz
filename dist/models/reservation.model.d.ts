import { Entity } from '@loopback/repository';
export declare class Reservation extends Entity {
    id: string;
    guestName: string;
    contactInfo: string;
    expectedArrivalTime: string;
    tableSize: number;
    status: string;
    userId: string;
    constructor(data?: Partial<Reservation>);
}
export interface ReservationRelations {
}
export type ReservationWithRelations = Reservation & ReservationRelations;
