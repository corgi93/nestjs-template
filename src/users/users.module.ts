import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [PrismaModule], // user모듈에 DB에 access할 수 있는 PrismaClient를 추상화한 PrismaService를 사용할 수 있다.
})
export class UsersModule {}
