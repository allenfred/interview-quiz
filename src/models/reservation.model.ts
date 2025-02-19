import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
    mongodb: {collection: 'reservations'},
  },
})
export class Reservation extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  guestName: string;

  @property({
    type: 'string',
    required: true,
  })
  contactInfo: string;

  @property({
    type: 'date',
    required: true,
  })
  expectedArrivalTime: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      enum: [1, 2, 3],
    },
  })
  tableSize: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['confirmed', 'canceled', 'completed'],
    },
    default: 'confirmed',
  })
  status: string;

  constructor(data?: Partial<Reservation>) {
    super(data);
  }
}

export interface ReservationRelations {
  // define navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations;
