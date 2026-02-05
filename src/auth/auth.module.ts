import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { BscryptService } from './hashing/bcrypt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    
  ],
  controllers: [AuthController],
  providers: [{
    provide: HashingService,
    useClass: BscryptService,
  },
  AuthService],
  exports: [HashingService]
})
export class AuthModule {}
