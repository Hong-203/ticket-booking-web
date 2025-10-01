import { registerAs } from '@nestjs/config';
import { Environment } from 'src/constants';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  environment: (process.env.NODE_ENV as Environment) || Environment.local,
}));
