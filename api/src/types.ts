import {Credentials} from '@loopback/authentication-jwt';

export interface MyCredentials extends Credentials {
  contactInfo: string;
  password: string;
  role: 'employee' | 'guest';
}
