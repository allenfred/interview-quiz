import {Entity, model, property} from '@loopback/repository';
import {field, ID, objectType} from '@loopback/graphql';

@objectType()
@model({
  settings: {
    strictObjectIDCoercion: true,
    mongodb: {collection: 'reservations'},
  },
})
export class Reservation extends Entity {
  @field(type => ID)
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @field()
  @property({
    type: 'string',
    required: true,
  })
  guestName: string;

  @field()
  @property({
    type: 'string',
    required: true,
  })
  contactInfo: string;

  @field()
  @property({
    type: 'date',
    required: true,
  })
  expectedArrivalTime: Date;

  @field()
  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      enum: [1, 2, 3],
    },
  })
  tableSize: number;

  @field()
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['confirmed', 'cancelled', 'completed'],
    },
    default: 'confirmed',
  })
  status: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {dataType: 'ObjectId'},
  })
  userId: string;

  constructor(data?: Partial<Reservation>) {
    super(data);
  }
}

export interface ReservationRelations {
  // define navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations;
