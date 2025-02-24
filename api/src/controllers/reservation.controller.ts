import {repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  api,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Reservation} from '../models';
import {ReservationRepository} from '../repositories';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {WinstonLogger, LoggingBindings} from '@loopback/logging';

@api({basePath: '/api'})
@authenticate('jwt')
export class ReservationController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
  ) {}

  @post('/reservations')
  @response(200, {
    description: 'Reservation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reservation)}},
  })
  @authorize({allowedRoles: ['guest']})
  async create(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {
            title: 'NewReservation',
            exclude: ['id', 'userId'],
          }),
        },
      },
    })
    reservation: Omit<Reservation, 'id' | 'userId'>,
  ): Promise<Reservation> {
    return this.reservationRepository.create({
      ...reservation,
      contactInfo: user.name,
      userId: user.id,
    });
  }

  @get('/reservations')
  @response(200, {
    description: 'Array of Reservation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Reservation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER) user: UserProfile,
  ): Promise<Reservation[]> {
    let filter = {};
    if (user.role === 'guest') {
      filter = {where: {userId: user.id}};
    }

    return this.reservationRepository.find(filter);
  }

  @get('/reservations/{id}')
  @response(200, {
    description: 'Reservation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reservation, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Reservation> {
    return this.reservationRepository.findById(id);
  }

  @patch('/reservations/{id}')
  @response(204, {
    description: 'Reservation PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {partial: true}),
        },
      },
    })
    reservation: Reservation,
  ): Promise<void> {
    try {
      await this.reservationRepository.updateById(id, reservation);
    } catch (e) {
      this.logger.error('Error updating reservation:', e);
    }
  }
}
