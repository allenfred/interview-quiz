import {field, inputType} from '@loopback/graphql';
import {Reservation} from '../models';
import {DateScalar} from './scalars';

@inputType()
export class ReservationInput implements Partial<Reservation> {
  @field()
  guestName: string;

  @field()
  contactInfo: string;

  @field(type => DateScalar)
  expectedArrivalTime: Date;

  @field(type => Number)
  tableSize: number;

  @field({nullable: true})
  status?: string;

  @field()
  userId: string;
}
