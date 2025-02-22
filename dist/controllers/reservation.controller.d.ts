import { Reservation } from '../models';
import { ReservationRepository } from '../repositories';
import { UserProfile } from '@loopback/security';
export declare class ReservationController {
    reservationRepository: ReservationRepository;
    private logger;
    constructor(reservationRepository: ReservationRepository);
    create(user: UserProfile, reservation: Omit<Reservation, 'id'>): Promise<Reservation>;
    find(user: UserProfile): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation>;
    updateById(id: string, reservation: Reservation): Promise<void>;
}
