import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PassThrough } from 'stream';
import { Not } from 'typeorm/browser';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}


  async create(createUserDto: CreateUserDto) {
    const userExiste = await this.userRepository.findOne({
      where: {
        name: createUserDto.name,
        email: createUserDto.email,
      }
    })

    if (userExiste){
          throw new UnauthorizedException ('Usuário já existente')
    }
    const newUser = await this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {

   
    const users = await this.userRepository.find({
      order: {
        id: 'asc'
      }
    })
    return users
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {id}
    })

    if (!user) {
      throw new NotFoundException ('Usuário não encontrado')
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      name: updateUserDto.name,
      email: updateUserDto.email
    })
    if (!user){
      throw new NotFoundException('Usuário não encontrado')
    }
    await this.userRepository.save(user)
    return user;
  }

  async remove(id: number) {
    
    const user = await this.userRepository.findOne({
      where: {id}
    })

    if (!user){
      throw new NotFoundException('Usuário não encontrado')
    }

    await this.userRepository.remove(user)
  }
}
