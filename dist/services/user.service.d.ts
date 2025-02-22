import { UserService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { User, UserWithPassword, UserWithRelations } from '../models';
import { MyUserRepository } from '../repositories';
import { PasswordHasher } from './hash.password.bcryptjs';
/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export type Credentials = {
    email: string;
    password: string;
};
export declare class MyUserService implements UserService<User, Credentials> {
    userRepository: MyUserRepository;
    passwordHasher: PasswordHasher;
    constructor(userRepository: MyUserRepository, passwordHasher: PasswordHasher);
    verifyCredentials(credentials: Credentials): Promise<User>;
    convertToUserProfile(user: User): UserProfile;
    createUser(userWithPassword: UserWithPassword): Promise<User>;
    findUserById(id: string): Promise<User & UserWithRelations>;
}
