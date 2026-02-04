import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PassThrough } from 'stream';
import { Not } from 'typeorm/browser';

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
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
