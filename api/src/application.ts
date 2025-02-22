import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
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
// import {JWTAuthenticationStrategy} from './strategies/jwt-strategy';
import {PasswordHasherBindings} from './keys';

export {ApplicationConfig};

export class InterviewQuizApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false, // default to true
      enableHttpAccessLog: true, // default to true
      level: 'info', // Set the log level
    });

    const consoleTransport = new WinstonTransports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    });
    this.bind('logging.winston.transports.console')
      .to(consoleTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));

    // registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

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

    // ------ ADD SNIPPET AT THE TOP ---------
    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    // ----------- END OF SNIPPET ------------

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // Bind user service
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    // Bind jwt service
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    // Bind user and credentials repository
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(MyUserRepository);
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      MyUserCredentialsRepository,
    );
    // ------------- END OF SNIPPET -------------

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
