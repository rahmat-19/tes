import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist";
import { ScheduleModule } from '@nestjs/schedule';
import { Activity } from "./entities/activity.entity";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { ActivityGateway } from "./activity.gateway";


@Module({
    imports: [TypeOrmModule.forFeature([Activity])],
    controllers: [ActivityController],
    providers: [ActivityService, ActivityGateway]
})

export class ActivityModule {}