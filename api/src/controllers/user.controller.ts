import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {api} from '@loopback/rest';
import {get, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {WinstonLogger, LoggingBindings} from '@loopback/logging';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {repository} from '@loopback/repository';
import {SchemaObject} from '@loopback/openapi-v3';
import {MyUserService} from '../services';
import {ReservationRepository} from '../repositories/reservation.repository';
import {MyUserRepository} from '../repositories/user.repository';
import {User, UserWithPassword} from '../models';
import {MyCredentials} from '../types';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['contactInfo', 'password', 'role'],
  properties: {
    contactInfo: {
      type: 'string',
      oneOf: [
        {format: 'email'},
        {pattern: '^[0-9]{11}$'}, // Assuming phone number is 11 digits
      ],
    },
    password: {
      type: 'string',
      minLength: 6,
    },
    role: {
      type: 'string',
      enum: ['employee', 'guest'],
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

const SignupSchema: SchemaObject = {
  type: 'object',
  required: ['name', 'email', 'password', 'phone', 'role'],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
    phone: {
      type: 'string',
    },
    role: {
      type: 'string',
      enum: ['employee', 'guest'],
    },
  },
};

export const SignupRequestBody = {
  description: 'The input of signup function',
  required: true,
  content: {
    'application/json': {schema: SignupSchema},
  },
};

@api({basePath: '/api'})
export class UserController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(MyUserRepository)
    protected userRepository: MyUserRepository,
    @repository(ReservationRepository)
    protected reservationRepository: ReservationRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    cors: true,
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: MyCredentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                email: {type: 'string'},
                phone: {type: 'string'},
                role: {type: 'string'},
              },
            },
          },
        },
      },
    },
    cors: true,
  })
  async signup(
    @requestBody(SignupRequestBody)
    newUserRequest: Omit<UserWithPassword, 'id'>,
  ): Promise<User> {
    return this.userService.createUser(newUserRequest);
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }
}
