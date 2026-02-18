import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { TaskComentService } from "./taskComent.service";
import { CreateComentTask } from "./dto/create-comentTask.dto";
import { TokenPayloadParam } from "src/auth/params/token-payload.param";
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";


@UseGuards(AuthTokenGuard)
@Controller('task-coment')
export class TaskComentController {

constructor (
    private readonly taskComentService: TaskComentService
){}

@Post() 
async create(
    @Body() createTaskComent: CreateComentTask,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto
) {
    return await this.taskComentService.create(createTaskComent, tokenPayloadDto)
}
}