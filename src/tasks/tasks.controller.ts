import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';

@UseGuards(AuthTokenGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}


  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto) {
    return this.tasksService.create(createTaskDto, tokenPayloadDto);
  }


  @Get()
  findAll(@TokenPayloadParam() tokenPayloadDto: TokenPayloadDto) {
    return this.tasksService.findAll(tokenPayloadDto);
  }

 
  @Get(':id')
  findOne(
    @Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.tasksService.update(id, updateTaskDto, tokenPayload);
  }

  @Delete(':id')
  remove(@Param('id') id: number,
    @TokenPayloadParam() tokenPayloadDto: TokenPayloadDto) {
    return this.tasksService.remove(id, tokenPayloadDto);
  }

  @Patch(':id/completed_task')
  completedTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto) {

    return this.tasksService.completedTask(id, updateTaskDto)

  }
}
