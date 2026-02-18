import { InjectRepository } from "@nestjs/typeorm";
import { TaskComent } from "./entities/taskComent.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { TasksService } from "src/tasks/tasks.service";
import { CreateComentTask } from "./dto/create-comentTask.dto";
import { TokenPayloadDto } from "src/auth/dto/token-payload.dto";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UpdateComentTask } from "./dto/update-comentTask.dto";

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

    async findOne (
        id:number
    ){

        const comentTask = await this.taskComentRepository.findOne({
            where: {id},
            relations: ['comented_to']
        })

        if (!comentTask) {
            throw new NotFoundException('Comentario não encontrado')
        }

        await this.taskComentRepository.save(comentTask)
        return comentTask

    }


    async update (
        id: number,
        updateComentTask: UpdateComentTask,
        tokenPayload: TokenPayloadDto
    ){
        const taskComent = await this.taskComentRepository.findOne({
            where: {id},
            relations: ['comented_to']
        })

        if (!taskComent) {
            throw new NotFoundException('Comentario não encontrado')
        }

        if (taskComent.comented_to.id !== tokenPayload.sub){
            throw new ForbiddenException ('Não é possivel atualizar esse comentario')
        }

        const update = await this.taskComentRepository.preload({
            id,
            coment: updateComentTask.coment,
        });

        if (!update) {
            throw new NotFoundException ('Tarefa não encontrada! ')
        }
        await this.taskComentRepository.save(update)
        return update
    }
}