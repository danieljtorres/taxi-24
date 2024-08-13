import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CONFIG_PROVIDER, Enviroment } from './env';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvService } from './env.service';

@Global()
@Module({})
export class EnvModule {
  static forRoot(): DynamicModule {
    if (!process.env.NODE_ENV) {
      throw new Error('Environment not defined!');
    }

    const validate = (config: typeof process.env) => {
      process.env = { ...config };
      const loadedConfig = new Enviroment();

      const validatedConfig = plainToInstance(Enviroment, loadedConfig, {
        enableImplicitConversion: true,
      });
      const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
      });
      if (errors.length > 0) throw new Error(errors.toString());

      return validatedConfig;
    };

    const envFilePath = [
      `./envs/.env.${process.env.NODE_ENV}`,
      `./envs/.env.example`,
    ];

    return {
      module: EnvModule,
      imports: [
        NestConfigModule.forRoot({
          envFilePath,
          validate,
          cache: true,
        }),
      ],
      providers: [
        {
          provide: CONFIG_PROVIDER,
          useClass: EnvService,
        },
      ],
      exports: [CONFIG_PROVIDER],
    };
  }
}
