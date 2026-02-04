import { Exclude } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { isWeakMap } from 'util/types';
export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    
    @IsNotEmpty()
    password: string;


}
