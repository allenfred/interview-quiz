# interview-quiz

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
yarn install
```

## Run the frontend application

```sh
cd app
yarn install
yarn start
```

## Run the backedn application

```sh
yarn install
yarn start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
yarn run build
```

To force a full build by cleaning up cached artifacts:

```sh
yarn run rebuild
```

## Fix code style and formatting issues

```sh
yarn run lint
```

To automatically fix such issues:

```sh
yarn run lint:fix
```

## Other useful commands

- `yarn run migrate`: Migrate database schemas for models
- `yarn run openapi-spec`: Generate OpenAPI spec into a file
- `yarn run docker:build`: Build a Docker image for this application
- `yarn run docker:run`: Run this application inside a Docker container

## Tests

```sh
yarn test
```

## Docker Setup

To start the frontend, backend, and MongoDB using docker-compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Navigate to the root directory of the project.
3. Run the following command to start all services:

```sh
docker-compose up --build
```

This command will build and start the following services:

- mongodb: A MongoDB instance.
- backend: The LoopBack 4 backend application.
- frontend: The React frontend application.

### Accessing the Services

Frontend: Open http://localhost:3000 in your browser.
Backend: The backend API will be available at http://localhost:3100.
MongoDB: MongoDB will be running on port 27017.

## User data from mongodb for Testing

| Name          | Email                     | Phone       | Role     | Password |
| ------------- | ------------------------- | ----------- | -------- | -------- |
| Alice Johnson | alice.johnson@example.com | 12345678910 | guest    | 123456   |
| Bob Brown     | bob.brown@example.com     | 09876543210 | employee | 123456   |
| Charlie Davis | charlie.davis@example.com | 11223344550 | guest    | 123456   |

## What's Next (Undo)

- Code Review & Bug fix
- Clean code
- Unit Tests
