import {UserProfile} from '@loopback/security';

export interface CustomUserProfile extends UserProfile {
  email?: string;
  roles?: string[];
  [key: string]: any;
}
