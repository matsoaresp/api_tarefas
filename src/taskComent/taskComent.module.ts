import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "src/tasks/tasks.module";
import { UsersModule } from "src/users/users.module";
import { TaskComentController } from "./taskComent.controller";
import { TaskComentService } from "./taskComent.service";
import { TaskComent } from "./entities/taskComent.entity";
import { TasksService } from "src/tasks/tasks.service";

@Module({
    controllers: [TaskComentController],
    providers: [TaskComentService],
    imports: [
        TypeOrmModule.forFeature([TaskComent]),
        UsersModule, 
        TasksModule
    ],
    exports: [TaskComentService]

})
export class TaskComentModule {}