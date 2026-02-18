import { TypesStatus } from "src/enums/types.enum";
import { Users } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskName: string;

    @Column()
    descricao: string;

    @Column({
        type: 'enum',
        enum: TypesStatus,
        default: TypesStatus.PENDENTE
    })
    state: TypesStatus;

    @Column({type: 'timestamp'})
    dueDate: Date;
    
    @ManyToOne(() => Users, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'criadaPor'})
    criadaPor: Users;

    


}
