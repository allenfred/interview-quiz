import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {
  LoggingComponent,
  LoggingBindings,
  WinstonTransports,
  WINSTON_TRANSPORT,
} from '@loopback/logging';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, extensionFor} from '@loopback/core';
import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MongodbDataSource} from './datasources';
import {MySequence} from './sequence';
import {format} from 'winston';
import {MyUserRepository, MyUserCredentialsRepository} from './repositories';
import {MyUserService, JWTService, BcryptHasher} from './services';
import {PasswordHasherBindings} from './keys';
import {ResolveAuthMiddleware} from './middlewares';
import {ReservationResolver} from './graphql-resolvers/reservation-resolver';

export {ApplicationConfig};

export class InterviewQuizApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // config graphql
    this.component(GraphQLComponent);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({
      asMiddlewareOnly: true,
    });

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    // To register one or more middlewares as per https://typegraphql.com/docs/middlewares.html
    server.middleware(ResolveAuthMiddleware);
    server.resolver(ReservationResolver);

    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // It's possible to register a graphql context resolver
    // this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(context => {
    //   return {...context};
    // });

    // configure logging
    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: true,
      level: 'info',
    });

    const consoleTransport = new WinstonTransports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    });
    this.bind('logging.winston.transports.console')
      .to(consoleTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(LoggingComponent);

    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    // Mount authentication system
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(MyUserRepository);
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      MyUserCredentialsRepository,
    );
    this.bind(TokenServiceBindings.TOKEN_SECRET).to('test');

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers', 'graphql-resolvers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
