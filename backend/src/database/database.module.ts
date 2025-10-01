// src/database/database.module.ts
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from 'src/constants'; // Đảm bảo đường dẫn này đúng

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('TypeOrm');

        // Lấy giá trị môi trường và xử lý trường hợp undefined
        // Chúng ta sẽ lấy từ process.env trực tiếp hoặc từ config service
        // Đảm bảo rằng trong file configuration.ts bạn đã có giá trị fallback như Environment.local
        const env: Environment =
          (config.get<string>('database.environment') as Environment) ||
          Environment.local;

        // Xác định xem có phải là môi trường production hay không
        const isProduction = env === Environment.production;

        // Log lỗi nếu database.name không được định nghĩa
        if (!config.get<string>('database.name')) {
          logger.error('Database name is not defined in configuration!');
        }

        return {
          type: 'mysql',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],

          // QUAN TRỌNG: synchronize chỉ nên TRUE trong môi trường DEV (bao gồm 'local', 'dev', 'test')!
          synchronize: [
            Environment.local,
            Environment.dev,
            Environment.test,
          ].includes(env),

          logging: ['error'], // Chỉ log lỗi của TypeORM
          logger: {
            log(level, message) {
              if (
                level === 'info' &&
                message.includes('connected to database')
              ) {
                logger.log('MySQL Database Connected Successfully!');
              }
              // Có thể thêm các mức log khác ở đây nếu cần
              // Ví dụ: if (level === 'warn') logger.warn(message);
              // if (level === 'error') logger.error(message);
            },
            logQuery(query, parameters) {
              if (!isProduction) {
                logger.debug(
                  `[TypeORM Query] ${query} -- Params: ${JSON.stringify(parameters)}`,
                );
              }
            },
            logQueryError(error, query, parameters) {
              logger.error(`[TypeORM Query Error] ${error}: ${query}`);
            },
            logQuerySlow(time, query, parameters) {
              // Thêm phương thức này để đáp ứng interface Logger của TypeORM
              if (!isProduction) {
                logger.warn(`[TypeORM Slow Query] (${time}ms) ${query}`);
              }
            },
            logSchemaBuild(message) {
              // Thêm phương thức này để đáp ứng interface Logger của TypeORM
              if (!isProduction) {
                logger.log(`[TypeORM Schema Build] ${message}`);
              }
            },
            logMigration(message) {
              // Thêm phương thức này để đáp ứng interface Logger của TypeORM
              if (!isProduction) {
                logger.log(`[TypeORM Migration] ${message}`);
              }
            },
            logConnection(message) {
              if (message.includes('connected')) {
                logger.log(`[TypeORM Connection] ${message}`);
              } else if (message.includes('disconnected')) {
                logger.warn(`[TypeORM Connection] ${message}`);
              }
            },
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
