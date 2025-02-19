import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Request} from '@loopback/rest';
import {HttpErrors} from '@loopback/rest';
import {MyTokenService} from '../services/token.service';
import {CustomUserProfile} from '../services/interface';

export class JWTAuthenticationStrategy {
  constructor(
    @inject('services.MyTokenService')
    public tokenService: MyTokenService,
  ) {}

  async authenticate(request: Request): Promise<CustomUserProfile | undefined> {
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new HttpErrors.Unauthorized('Token is missing');
    }

    const userProfile = await this.tokenService.verifyToken(token);

    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    // 在这里扩展 userProfile 添加额外的字段
    const extendedProfile: CustomUserProfile = {
      [securityId]: userProfile.sub,
      name: userProfile.name,
      email: userProfile.email, // 假设你从 JWT payload 中解码了 email
      roles: userProfile.roles, // 假设你从 JWT payload 中解码了 roles
    };

    return extendedProfile;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.slice(7, authorizationHeader.length);
    }
    return undefined;
  }
}
