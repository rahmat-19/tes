import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from './activity/activity.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'superbajing',
      database: 'test_interview',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    ActivityModule
  ],
})
export class AppModule {

}
