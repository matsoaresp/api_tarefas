import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar'})
    name: string

    @Column({type: 'varchar'})
    email: string

    @Exclude()
    @Column({type: 'varchar'})
    password: string;
}
