// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import _ from 'lodash';
import {User, UserWithPassword, UserWithRelations} from '../models';
import {MyUserRepository} from '../repositories';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from './hash.password.bcryptjs';
import {MyCredentials} from '../types';

export class MyUserService implements UserService<User, MyCredentials> {
  constructor(
    @repository(MyUserRepository) public userRepository: MyUserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: MyCredentials): Promise<User> {
    const invalidCredentialsError = `Invalid contactInfo or password for ${credentials.role}.`;

    const foundUser = await this.userRepository.findOne({
      where: {
        or: [
          {email: credentials.contactInfo},
          {phone: credentials.contactInfo},
        ],
        role: credentials.role,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id.toString(),
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  }

  async createUser(
    userWithPassword: Omit<UserWithPassword, 'id'>,
  ): Promise<User> {
    const password = await this.passwordHasher.hashPassword(
      userWithPassword.password,
    );

    userWithPassword.password = password;
    const user = await this.userRepository.create(
      _.omit(userWithPassword, 'password'),
    );
    user.id = user.id.toString();
    await this.userRepository.userCredentials(user.id).create({password});
    return user;
  }

  // function to find user by id
  async findUserById(id: string): Promise<User & UserWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
}
