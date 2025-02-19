import {AuthenticationComponent, TokenService} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {LoggingComponent, LoggingBindings} from '@loopback/logging';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings, RestServerConfig} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MongodbDataSource} from './datasources';
import {MySequence} from './sequence';

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

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongodbDataSource, UserServiceBindings.DATASOURCE_NAME);
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
