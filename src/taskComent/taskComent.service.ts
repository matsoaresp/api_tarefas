import { InjectRepository } from "@nestjs/typeorm";
import { TaskComent } from "./entities/taskComent.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { TasksService } from "src/tasks/tasks.service";
import { CreateComentTask } from "./dto/create-comentTask.dto";
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";
import { NotFoundException } from "@nestjs/common";

export class TaskComentService {

    constructor(
        @InjectRepository(TaskComent)
        private readonly taskComentRepository: Repository<TaskComent>,
        private readonly userService: UsersService,
        private readonly taskService: TasksService,
    ){} 

    async create(
        createComentTask: CreateComentTask,
        tokenPayload: TokenPayloadDto
    ){

        const user = await this.userService.findOne (
            tokenPayload.sub
        )

        if (!user) {
            throw new NotFoundException('Usuario não encontrado! ')
        }

        const task = await this.taskService.findOne (
            createComentTask.taskId
        )

        if (!task) {
            throw new NotFoundException('Tarefa não encontrada')
        }

        const now = new Date();

        const taskComent = await this.taskComentRepository.create({
            comented_to: user,
            task: task,
            coment: createComentTask.coment,
            created_at: now
        })
        await this.taskComentRepository.save(taskComent)

        return await this.taskComentRepository.findOne({
            where: {id: taskComent.id},
            relations: ['task', 'comented_to']
        })
    }

   
}