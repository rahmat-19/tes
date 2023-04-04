import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist";
import { User } from "./entities/user.entity";
import { UserControler } from "./user.controller";
import { UserService } from "./user.service";
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports: [TypeOrmModule.forFeature([User]), ScheduleModule.forRoot()],
    controllers: [UserControler],
    providers: [UserService]
})

export class UserModule {}