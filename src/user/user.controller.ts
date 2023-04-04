import { Controller, Get, Body, HttpStatus, Post, Put, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserControler {
    constructor(private userService: UserService){}

    @Get()
    async findAll () {
        const [data, count] = await this.userService.findAll();
        return { data, count };
    }

    @Get(':id')
    async findOne (
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return {data : await this.userService.findOne(id)}
    }

    @Post()
    async create(@Body() createUserDti: CreateUserDto) {
        try {
            const user = await this.userService.create(createUserDti);
            await this.userService.activateUserAfterTwoMinutes(user.id);
        }
        catch (e) {
            return e;
        }
    }

    @Put(":id")
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return {
            data: await this.userService.update(id, updateUserDto),
            statusCode: HttpStatus.OK,
            message: 'success',
        };
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.userService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'success'
        }
    }
}