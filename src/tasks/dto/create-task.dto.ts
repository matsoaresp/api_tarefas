import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TypesStatus } from "src/enums/types.enum";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    taskName: string;


    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsEnum(TypesStatus)
    @IsOptional()
    state: TypesStatus

    @IsOptional()
    @IsDateString()
    dueDate: string;


}
