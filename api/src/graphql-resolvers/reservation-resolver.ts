import {inject} from '@loopback/core';
import {
  arg,
  Ctx,
  GraphQLBindings,
  mutation,
  Publisher,
  pubSub,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {WinstonLogger, LoggingBindings} from '@loopback/logging';
import {ReservationInput} from '../graphql-types/reservation-input';
import {Reservation, User} from '../models';
import {ReservationRepository} from '../repositories';

export interface Context {
  user?: User;
}

@resolver(of => Reservation)
export class ReservationResolver {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(ReservationRepository)
    private readonly reservationRepo: ReservationRepository,
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,
  ) {}

  @query(returns => Reservation, {nullable: true})
  async reservation(
    @arg('reservationId') reservationId: string,
    @Ctx() ctx: Context,
  ) {
    this.logger.info('ctx', ctx.user);
    return this.reservationRepo.findById(reservationId);
  }

  @query(returns => [Reservation])
  async reservations(): Promise<Reservation[]> {
    return this.reservationRepo.find();
  }

  // @Authorized('guest')
  @mutation(returns => Reservation)
  async addReservation(
    @arg('reservation') reservation: ReservationInput,
    @pubSub('reservationCreated') publish: Publisher<Reservation>,
  ): Promise<Reservation> {
    const result = await this.reservationRepo.create(reservation);
    await publish(result);
    return result;
  }
}
