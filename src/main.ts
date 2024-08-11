import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // validation체크를 위한 NestJS Pipe에서 validationPipe 설정
    // {whitelist: true}로 하면 만약 처리기에서 email, password만 기대하는데
    // age라는 값이 들어오면 pipe에서 자동으로 제거해서 필터링 해준다.
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // NestJS Interceptor
    // Interceptor를 사용해 request-response에서 router핸들러 실행 전후에 추가적인 논리 실행을 추가할 수 있다.
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    const config = new DocumentBuilder()
        .setTitle('dev')
        .addServer('/api')
        .setDescription('dev api 문서')
        .setVersion('1.0')
        .build();

    // swagger문서 생성 (애플리케이션 ,  swagger 설정)
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // exception필터 application 전체에서 적용
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.listen(3000);
}
bootstrap();
