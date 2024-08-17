import { MongoEnv } from '@Infrastructure/nestjs/env';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const createMongooseOptions = (
  config: MongoEnv,
): MongooseModuleOptions => {
  const { database, user, password, host } = config;

  const usernamePass = user ? `${user}:${password}@` : '';

  const uri = `mongodb://${usernamePass}${host}/${database}?retryWrites=true&w=majority`;

  return {
    uri: uri,
  };
};
