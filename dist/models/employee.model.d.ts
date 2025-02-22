import { Entity } from '@loopback/repository';
export declare class Employee extends Entity {
    id: string;
    name: string;
    contactInfo: string;
    constructor(data?: Partial<Employee>);
}
export interface EmployeeRelations {
}
export type EmployeeWithRelations = Employee & EmployeeRelations;
