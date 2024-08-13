import { Module } from '@nestjs/common';
import { MongooseModule } from './mongo/mongoose.module';

@Module({
  imports: [MongooseModule],
  exports: [MongooseModule],
})
export class DatabaseModule {}
