import { UserProfile } from '@loopback/security';
export interface CustomUserProfile extends UserProfile {
    email?: string;
    contactInfo?: string;
    roles?: string[];
    [key: string]: unknown;
}
