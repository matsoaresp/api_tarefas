import { Global, Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { HashingService } from './hashing/hashing.service';
import { BscryptService } from './hashing/bcrypt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        const jwt = ConfigService.get('jwt');

        return {
          secret: jwt.secret,
          signOptions: {
            audience: jwt.audience,
            issuer: jwt.issuer,
            expiresIn: jwt.jwtTtl,
          },
        };
      },
    }),

  ],
  controllers: [AuthController],
  providers: [{
    provide: HashingService,
    useClass: BscryptService,
  },
    AuthService],
  exports: [HashingService, JwtModule, ConfigModule]
})
export class AuthModule { }
