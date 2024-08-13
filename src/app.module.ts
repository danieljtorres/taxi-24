import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DatabaseModule } from '@Infrastructure/database/database.module';
import { EnvModule } from '@Infrastructure/env/env.module';

@Module({
  imports: [
    EnvModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
