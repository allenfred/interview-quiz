import { TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { MyUserService } from '@loopback/authentication-jwt';
import { SchemaObject } from '@loopback/openapi-v3';
import { ReservationRepository } from '../repositories/reservation.repository';
import { MyUserRepository } from '../repositories/user.repository';
import { UserWithPassword } from '../models';
export declare const CredentialsRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: SchemaObject;
        };
    };
};
export declare const SignupRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: SchemaObject;
        };
    };
};
export interface Credentials {
    email: string;
    password: string;
    role: 'employee' | 'guest';
}
export declare class UserController {
    jwtService: TokenService;
    userService: MyUserService;
    user: UserProfile;
    protected userRepository: MyUserRepository;
    protected reservationRepository: ReservationRepository;
    private logger;
    constructor(jwtService: TokenService, userService: MyUserService, user: UserProfile, userRepository: MyUserRepository, reservationRepository: ReservationRepository);
    login(credentials: Credentials): Promise<{
        token: string;
    }>;
    signup(newUserRequest: Omit<UserWithPassword, 'id'>): Promise<UserWithPassword>;
    whoAmI(currentUserProfile: UserProfile): Promise<UserProfile>;
}
