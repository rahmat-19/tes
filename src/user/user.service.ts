import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from "@nestjs/typeorm/dist";
import { Db, EntityNotFoundError, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){}

    async findAll(): Promise<[User[], number]> {
        return await this.userRepository.findAndCount()
    }

    async findOne(id: string) {
        try {
            return await this.userRepository.findOneOrFail({
                where: {
                    id,
                },
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw e;
            }
        }
    }

    async create(createUserDto: CreateUserDto) {
        const user = new User()
        user.name = createUserDto.name;

        const result = await this.userRepository.insert(user);

        return this.userRepository.findOneOrFail({
            where: {
                id: result.identifiers[0].id,
            },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            await this.userRepository.findOneOrFail({
                where: {
                    id,
                }
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            } else {
                throw e;
            }
        }

        const user = new User();
        user.name = updateUserDto.name
        await this.userRepository.update(id, user);

        return this.userRepository.findOneOrFail({
            where: {
                id,
            },
        });
    }

    async remove(id: string) {
        try {
            await this.userRepository.findOneOrFail({
                where: {
                    id,
                },
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Data not found',
                },
                HttpStatus.NOT_FOUND,
                );
            } else {
                throw e;
            }
        }

        await this.userRepository.delete(id);
    }

    async activateUserAfterTwoMinutes(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        })
        setTimeout(async () => {
            user.isActive = true;
            await this.userRepository.save(user);
          }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }

    // @Cron('0 */5 * * * *')
    // async handleUpdateuser() {

    //     const dateNow = new Date().getTime()
    //     const [users, count] = await this.userRepository.findAndCount();

    //     const filterUsers = users.filter(data => data.isActive !== true).map(data => data.id);

    //     if (filterUsers.length > 0) {
    //         filterUsers.map(data => {
    //             this.userRepository
    //                 .createQueryBuilder()
    //                 .update()
    //                 .set({
    //                     isActive: true
    //                 })
    //                 .where("id = :id", {id: data})
    //                 .execute()
    //         })
    //         console.log('ok');

    //     }

    // }


}