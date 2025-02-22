/// <reference types="express" />
import { OASEnhancer, OpenApiSpec, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { AuthenticationStrategy } from '@loopback/authentication';
import { JWTService } from '@loopback/authentication-jwt';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
    tokenService: JWTService;
    name: string;
    constructor(tokenService: JWTService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractCredentials(request: Request): string;
    modifySpec(spec: OpenApiSpec): OpenApiSpec;
}
