import { IsNotEmpty, IsSemVer, IsString } from "class-validator";

export class CreateComentTask {


    @IsNotEmpty() 
    @IsString()
    taskId: number;

    @IsNotEmpty() 
    @IsString() 
    coment: string;

}