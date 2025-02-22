/// <reference types="express" />
import { OASEnhancer, OpenApiSpec, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationStrategy } from '@loopback/authentication';
import { MyUserService } from '../services/user.service';
export interface BasicAuthenticationStrategyCredentials {
    username: string;
    password: string;
}
export declare class BasicAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
    private userService;
    name: string;
    constructor(userService: MyUserService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): BasicAuthenticationStrategyCredentials;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
