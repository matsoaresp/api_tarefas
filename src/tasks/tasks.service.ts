import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TypesStatus } from 'src/enums/types.enum';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly repositoryTask: Repository<Task>,
    private readonly userService: UsersService,
  ) { }
  async create(createTaskDto: CreateTaskDto, tokenPayload: TokenPayloadDto) {

    const user = await this.userService.findOne(
      tokenPayload.sub
    )

    if(!user) {
      throw new NotFoundException('Usuario não econtrado! ')
    }
     const now = new Date();

  
    const dueDate = new Date(now.getTime() + 60 * 60 * 1000);

    const task = await this.repositoryTask.create({
      taskName: createTaskDto.taskName,
      descricao: createTaskDto.descricao,
      state: createTaskDto.state ?? TypesStatus.PENDENTE,
      dueDate,
      criadaPor: user,
    })
    await this.repositoryTask.save(task);
    return task;
  }

  async findAll(tokenPayload: TokenPayloadDto) {
    const tasks = await this.repositoryTask.find({
      where: {
      criadaPor: {
        id: tokenPayload.sub,
      },
    },
      relations: ['criadaPor'],
      order: {
        id: 'asc'
      },
      select: {
        id: true,
        taskName: true,
        descricao: true,
        state: true,
        dueDate:true,
        criadaPor: {
          id: true,
          name: true,
          email: true
        }
      }
    });


    if(!tasks) {
      throw new NotFoundException('Tarefas não encontradas!')
    }

    return tasks;
  }

  async findOne(id: number) {
    const task = await this.repositoryTask.findOne({
      where: { id },
      relations: ['criadaPor']
    });
    if(!task) {
      throw new NotFoundException('Tarefa não encontrada!')
    }

    const now = new Date()
    if(task.state === TypesStatus.PENDENTE && task.dueDate < now) {
      task.state = TypesStatus.ATRASADO
      await this.repositoryTask.save(task)
    }
    return task;
  }

  async update(
    id: number, 
    updateTaskDto: UpdateTaskDto,
    tokenPayload: TokenPayloadDto) {

    const task = await this.findOne(id)

    if (task.criadaPor.id !== tokenPayload.sub){
      throw new ForbiddenException('Esse serviço não é seu')
    }
    const service = await this.repositoryTask.preload({
      id,
      taskName: updateTaskDto.taskName,
      descricao: updateTaskDto.descricao,
    })

    if(!service) {
      throw new NotFoundException('Tarefa não encontrada!')
    }
    await this.repositoryTask.save(service);
    return service;
  }

  async remove(
    id: number, 
    tokenPayload: TokenPayloadDto) {

    const task = await this.repositoryTask.findOne({
      where: { id }
    })

    if(!task) {
      throw new NotFoundException('Tafera não encontrada')
    }

    if (task.id !== tokenPayload.sub){
      throw new ForbiddenException('Esse serviço não é seu')
    }

    await this.repositoryTask.remove(task);
    return task;
  }

  async completedTask(id: number, updateTaskDto: UpdateTaskDto) {

    const task = await this.repositoryTask.preload({
      id,
      ...updateTaskDto,
      state: TypesStatus.CONCLUIDO
    })

    if(!task) {
      throw new NotFoundException('Tarefa não encontrada!')
    }
    return this.repositoryTask.save(task)
  }

  async lateTask (id: number, updateTaskDto: UpdateTaskDto){
    const task = await this.repositoryTask.preload({
      id,
      ...updateTaskDto,
      state: TypesStatus.ATRASADO
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!')
    }

    return this.repositoryTask.save(task)
  }
}