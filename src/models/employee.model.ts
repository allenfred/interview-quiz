import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
    mongodb: {collection: 'employees'},
  },
})
export class Employee extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  contactInfo: string;

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // define navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
