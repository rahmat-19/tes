import { IsNotEmpty, IsString } from "class-validator";

export class CreateActivityDto {
    @IsNotEmpty()
    @IsString()
    activity: string
}