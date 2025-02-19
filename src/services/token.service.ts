import {inject, injectable} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {CustomUserProfile} from './interface';
import {securityId} from '@loopback/security';
import {TokenService} from '@loopback/authentication';

@injectable()
export class MyTokenService {
  constructor(
    @inject('services.TokenService') private tokenService: TokenService,
  ) {}

  async verifyToken(token: string): Promise<CustomUserProfile | undefined> {
    try {
      const decoded = await this.tokenService.verifyToken(token);
      console.log('decoded', decoded);

      return {
        [securityId]: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        roles: decoded.roles,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
