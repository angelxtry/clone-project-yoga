import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  database: 'uber_origin',
  synchronize: true,
  logging: true,
  entities: ['dist/entities/**/*.*'],
  host: process.env.DB,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

export default connectionOptions;
