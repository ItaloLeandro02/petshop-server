import { Module } from '@nestjs/common';
import { BackofficeModule } from './modules/backoffice/backoffice.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://omnistack:IL0604@cluster0-lvbc1.mongodb.net/7180?retryWrites=true&w=majority'),
    BackofficeModule,
    StoreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
