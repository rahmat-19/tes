import { Controller, Get, Body, HttpStatus, Post, Put, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService){}

    @Get()
    async findAll () {
        const data = await this.activityService.findAll();
        return { data };
    }

    @Post()
    async create(@Body() createActivityDto: CreateActivityDto) {
        try {
            return {
                data: await this.activityService.create(createActivityDto),
                statusCode: HttpStatus.CREATED,
                message: 'success',
            };
        }
        catch (e) {
            return e;
        }
    }

}