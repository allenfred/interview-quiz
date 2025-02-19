import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  api,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Reservation} from '../models';
import {ReservationRepository} from '../repositories';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

@api({basePath: '/api'})
@authenticate('jwt')
export class ReservationController {
  constructor(
    @repository(ReservationRepository)
    public reservationRepository: ReservationRepository,
  ) {}

  @post('/reservations')
  @response(200, {
    description: 'Reservation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reservation)}},
  })
  async create(
    @inject(SecurityBindings.USER) user: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservation, {
            title: 'NewReservation',
          }),
        },
      },
    })
    reservation: Omit<Reservation, 'id'>,
  ): Promise<Reservation> {
    return this.reservationRepository.create({
      ...reservation,
      contactInfo: user.name,
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
    @param.filter(Reservation) filter?: Filter<Reservation>,
  ): Promise<Reservation[]> {
    if (user.id === 'guest') {
      // If the user is a guest, filter reservations by contactInfo
      filter = filter || {};
      filter.where = filter.where || {};
      (filter.where as {contactInfo?: string}).contactInfo = user.name;
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
      console.error('Error updating reservation:', e);
    }
  }
}
