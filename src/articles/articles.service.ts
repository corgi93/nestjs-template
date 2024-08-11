import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
    // 생성자 추가(prisma초기화)
    constructor(private prisma: PrismaService) {}

    create(createArticleDto: CreateArticleDto) {
        return this.prisma.article.create({ data: createArticleDto });
    }
    findDrafts() {
        return this.prisma.article.findMany({ where: { published: false } });
    }

    findAll() {
        // 게시된 글 모두 반환
        return this.prisma.article.findMany({ where: { published: true } });
    }

    findOne(id: number) {
        // include로 author 객체도 반환
        return this.prisma.article.findUnique({
            where: { id },
            include: {
                author: true,
            },
        });
    }

    //TODO:  DB에 id 아티클 없으면 오류 반환. error handling 추후에
    update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.prisma.article.update({
            where: { id },
            data: updateArticleDto,
        });
    }

    remove(id: number) {
        return this.prisma.article.delete({ where: { id } });
    }
}
