import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// prisma.module에 추가해 PrismaService '싱글톤' 객체를 생성해 서비스를 제공할 수 있다.
@Injectable()
export class PrismaService extends PrismaClient {}
