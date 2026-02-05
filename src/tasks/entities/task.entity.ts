import { timestamp } from "rxjs";
import { TypesStatus } from "src/enums/types.enum";
import { User } from "src/users/entities/user.entity";
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
    
    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'criadaPor'})
    criadaPor: User;

    


}
