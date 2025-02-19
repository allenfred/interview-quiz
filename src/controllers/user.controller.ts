import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {api} from '@loopback/rest';
import {get, post, requestBody, getModelSchemaRef} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
  TokenServiceBindings,
  UserServiceBindings,
  User,
  MyUserService,
  UserRepository,
} from '@loopback/authentication-jwt';
import {model, property, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {SchemaObject} from '@loopback/openapi-v3';
import {ReservationRepository} from '../repositories/reservation.repository';
import {EmployeeRepository} from '../repositories/employee.repository';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['contact_info', 'password', 'role'],
  properties: {
    contactInfo: {
      type: 'string',
      oneOf: [
        {format: 'email'},
        {pattern: '^[0-9]{11}$'}, // Assuming phone number is 11 digits
      ],
    },
    verificationCode: {
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

export interface Credentials {
  contactInfo: string;
  verificationCode: string;
  role: 'employee' | 'guest';
}

@api({basePath: '/api'})
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(EmployeeRepository)
    protected employeeRepository: EmployeeRepository,
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
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    let userProfile: UserProfile;
    if (credentials.role === 'employee') {
      // Check if the employee exists
      const employee = await this.employeeRepository.findOne({
        where: {contactInfo: credentials.contactInfo},
      });

      if (!employee) {
        throw new HttpErrors.NotFound('Employee not found');
      }

      // Convert employee to UserProfile
      userProfile = {
        [securityId]: employee.id,
        name: employee.contactInfo, // Use the contactInfo as the name
        id: employee.id,
      };
    } else {
      // Default to guest
      userProfile = {
        [securityId]: 'guest',
        name: credentials.contactInfo, // Use the contactInfo as the name
        id: 'guest',
      };
    }

    // Create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
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
  ): Promise<string> {
    return currentUserProfile[securityId];
  }
}
