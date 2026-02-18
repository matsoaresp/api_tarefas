import { Exclude } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @Exclude()
    @IsNotEmpty()
    password: string;


}
