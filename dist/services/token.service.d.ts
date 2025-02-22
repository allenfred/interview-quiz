import { CustomUserProfile } from './interface';
import { TokenService } from '@loopback/authentication';
export declare class MyTokenService {
    private tokenService;
    constructor(tokenService: TokenService);
    verifyToken(token: string): Promise<CustomUserProfile | undefined>;
}
