import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [ArticlesController],
    providers: [ArticlesService],
    imports: [PrismaModule], // prismaModule import하므로 article에서 prismaService를 사용가능
})
export class ArticlesModule {}
