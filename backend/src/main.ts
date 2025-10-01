import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_PREFIX } from './constants';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { setupSwagger } from './config/setup-swagger';
import { AllExceptionsFilter } from './filters/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`/${API_PREFIX}`);

  app.use(helmet());
  app.use(morgan('dev'));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  const port = process.env.APP_PORT ?? 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  const serverMethod = process.env.APP_SERVER_METHOD ?? 'http';
  const serverHost = process.env.APP_SERVER_HOST ?? 'localhost';
  const appName = process.env.APP_NAME ?? 'App';
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  logger.log(`${appName} is running in ${nodeEnv} mode`);
  logger.log(
    `🚀 App listening on: ${serverMethod}://${serverHost}/${API_PREFIX}`,
  );
  logger.log(
    `📚 Swagger available at: ${serverMethod}://${serverHost}/${API_PREFIX}/documentation`,
  );
}
bootstrap();
