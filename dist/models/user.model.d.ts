import { Entity } from '@loopback/repository';
import { UserCredentials } from './user-credentials.model';
export declare class User extends Entity {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'guest' | 'employee';
    userCredentials: UserCredentials;
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export type UserWithRelations = User & UserRelations;
