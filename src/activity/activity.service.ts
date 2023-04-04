import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from "@nestjs/typeorm/dist";
import { EntityNotFoundError, Repository } from "typeorm";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { Activity } from "./entities/activity.entity";

@Injectable()
export class ActivityService{
    constructor(
        @InjectRepository(Activity)
        private activityRepository : Repository<Activity>
    ){}

    private lastActivity: any = [];


    async findAll()
    {
        const data = await this.activityRepository
        .createQueryBuilder('activity')
        .select('activity.activity as activity')
        .addSelect('COUNT(activity.activity)', 'activityCount')
        .groupBy('activity.activity')
        .getRawMany()
        return data

    }


    async pushActivity(createActivityDto: CreateActivityDto) {
        this.lastActivity.push(createActivityDto)
        return createActivityDto
    }

    async getLastActivity() {
        return this.lastActivity
    }

    async saveLastActivity() {
        // console.log('save Last Activity');
        const saveData = await this.activityRepository.save(this.lastActivity)
        if (saveData) {
            this.lastActivity = []
            return '2000'
        }
    }

    async create(createActivityDto: CreateActivityDto)
    {
        const activity = new Activity()
        activity.activity = createActivityDto.activity;

        const result = await this.activityRepository.insert(activity);

        return this.activityRepository.findOneOrFail({
            where: {
                id: result.identifiers[0].id,
            },
        });
    }
}