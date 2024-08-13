import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Enviroment } from './env';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Enviroment, true>) {}

  get<T extends keyof Enviroment>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
