import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";

import { TaskComentService } from "./taskComent.service";
import { CreateComentTask } from "./dto/create-comentTask.dto";
import { TokenPayloadParam } from "src/auth/params/token-payload.param";
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { UpdateComentTask } from "./dto/update-comentTask.dto";


@UseGuards(AuthTokenGuard)
@Controller('task-coment')
export class TaskComentController {
    constructor(
        private readonly taskComentService: TaskComentService
    ) { }
    @Post()
    async create(
        @Body() createTaskComent: CreateComentTask,
        @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto
    ) {
        return await this.taskComentService.create(createTaskComent, tokenPayloadDto)
    }

    @Get(":id")  
    async findOne(
        @Param('id') id: number
    ) {
        return await this.taskComentService.findOne(id)
    }

    @Patch(":id")
    async update (
        @Param('id', ParseIntPipe) id: number,
        @Body() updateComentTask: UpdateComentTask,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    ) {
        return await this.taskComentService.update(id,updateComentTask,tokenPayload)
    }

    @Delete(":id")
    async delete (
        @Param('id', ParseIntPipe) id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ) {
       
        return await this.taskComentService.delete(id,tokenPayload)
    }
}