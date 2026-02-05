import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TypesStatus } from 'src/enums/types.enum';
import { Type } from 'class-transformer';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly repositoryTask: Repository<Task>,
    private readonly userService: UsersService,
  ) { }
  async create(createTaskDto: CreateTaskDto, userId: number) {

    const user = await this.userService.findOne(userId)

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

  async findAll() {
    const tasks = await this.repositoryTask.find({
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

  async update(id: number, updateTaskDto: UpdateTaskDto) {

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

  async remove(id: number) {

    const task = await this.repositoryTask.findOne({
      where: { id }
    })

    if(!task) {
      throw new NotFoundException('Tafera não encontrada')
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
      throw new NotFoundException('Tarefa não encontrada')
    }
    return this.repositoryTask.save(task)
  }
}