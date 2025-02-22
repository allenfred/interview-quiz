import { BindingKey } from '@loopback/context';
import { PasswordHasher } from './services';
export declare namespace PasswordHasherBindings {
    const PASSWORD_HASHER: BindingKey<PasswordHasher<string>>;
    const ROUNDS: BindingKey<number>;
}
