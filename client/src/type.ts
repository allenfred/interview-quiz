export enum Role {
  Guest = 'guest',
  Employee = 'employee',
}

export interface Reservation {
  id?: string;
  guestName: string;
  contactInfo: string;
  arrivalTime: string;
  tableSize: number;
  status: string;
}

export enum ReservationStatusEnum {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export type ReservationStatus = 'confirmed' | 'cancelled' | 'completed';

export enum AuthStatus {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}
