import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ){}

  async login(loginDto: LoginDto) {  
    let passwordValid = false;

    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });
    
    if (!user){
      throw new UnauthorizedException ('Usuario não existe')
    }


    passwordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordValid){
      throw new UnauthorizedException('Senha inválida');
    }

    const accesToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
{
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );

    return {
      accesToken,
    };
  }
}
