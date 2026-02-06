import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { PassThrough } from 'stream';
import { Not } from 'typeorm/browser';
import { NotFoundError } from 'rxjs';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { emit } from 'process';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly hashingService: HashingService,
  ) {}


  async create(createUserDto: CreateUserDto) {

    const passwordHash = await this.hashingService.hash(
      createUserDto.password
    ) 
    
    const userData = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: passwordHash
    }
    

    const existUser = await this.userRepository.findOne({
      where: {
        name: createUserDto.name,
        email: createUserDto.email,
      }
    })

    if (existUser){
          throw new UnauthorizedException ('Usuário já existente')
    }
    const newUser = await this.userRepository.create(userData);
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

 async update(id: number,
     updateUserDto: UpdateUserDto,
     tokenPayload: TokenPayloadDto
    ) {

    const dadosClient = {
      name: updateUserDto?.name,
    }

    if (updateUserDto?.password){
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password
      );

      dadosClient['passwordHash'] = passwordHash
    }

    const client = await this.userRepository.preload({
      id,
      name: updateUserDto?.name,
      email: updateUserDto?.email,
    })

    if (!client)
      throw new NotFoundException('Client não encontrado')

    if (client.id !== tokenPayload.sub){
      throw new ForbiddenException('Você não é essa pessoa')
    }
    
    return this.userRepository.save(client)
  }

  async remove(
    id: number,
    tokenPayload: TokenPayloadDto
  ) {

    const client = await this.findOne(id)

     if (client.id !== tokenPayload.sub){
      throw new ForbiddenException('Você não é essa pessoa')
    }
    
    if (!client) 
      throw new NotFoundException('Cliente não encontrado')

   
    return this.userRepository.remove(client)
  }
}
