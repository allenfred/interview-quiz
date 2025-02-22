"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQuizApplication = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const logging_1 = require("@loopback/logging");
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const path_1 = tslib_1.__importDefault(require("path"));
const datasources_1 = require("./datasources");
const sequence_1 = require("./sequence");
const winston_1 = require("winston");
const repositories_1 = require("./repositories");
const services_1 = require("./services");
// import {JWTAuthenticationStrategy} from './strategies/jwt-strategy';
const keys_1 = require("./keys");
class InterviewQuizApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.configure(logging_1.LoggingBindings.COMPONENT).to({
            enableFluent: false,
            enableHttpAccessLog: true,
            level: 'info', // Set the log level
        });
        const consoleTransport = new logging_1.WinstonTransports.Console({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
        });
        this.bind('logging.winston.transports.console')
            .to(consoleTransport)
            .apply((0, core_1.extensionFor)(logging_1.WINSTON_TRANSPORT));
        // registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.component(logging_1.LoggingComponent);
        // ------ ADD SNIPPET AT THE TOP ---------
        // Bind bcrypt hash services
        this.bind(keys_1.PasswordHasherBindings.ROUNDS).to(10);
        this.bind(keys_1.PasswordHasherBindings.PASSWORD_HASHER).toClass(services_1.BcryptHasher);
        // ----------- END OF SNIPPET ------------
        // ------ ADD SNIPPET AT THE BOTTOM ---------
        // Mount authentication system
        this.component(authentication_1.AuthenticationComponent);
        // Mount jwt component
        this.component(authentication_jwt_1.JWTAuthenticationComponent);
        // Bind datasource
        this.dataSource(datasources_1.MongodbDataSource, authentication_jwt_1.UserServiceBindings.DATASOURCE_NAME);
        // Bind user service
        this.bind(authentication_jwt_1.UserServiceBindings.USER_SERVICE).toClass(services_1.MyUserService);
        // Bind jwt service
        this.bind(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE).toClass(services_1.JWTService);
        // Bind user and credentials repository
        this.bind(authentication_jwt_1.UserServiceBindings.USER_REPOSITORY).toClass(repositories_1.MyUserRepository);
        this.bind(authentication_jwt_1.UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(repositories_1.MyUserCredentialsRepository);
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
exports.InterviewQuizApplication = InterviewQuizApplication;
//# sourceMappingURL=application.js.map