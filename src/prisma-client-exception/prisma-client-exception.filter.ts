import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

// PrismaClientKnownRequestError 데코레이터 추가
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        console.error(exception.message); // 디버깅용 error log
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const message = exception.message.replace(/\n/g, '');

        switch (exception.code) {
            case 'P2002': {
                // p2002는 409 conflict (고유한 값 제약 조건 위반)
                // ex) title은 unique해서 db에 있는 값을 받으면 409 conflict error
                const status = HttpStatus.CONFLICT;
                response.status(status).json({
                    statusCode: status,
                    message: message,
                });
                break;
            }
            default:
                // default 500 에러 뱉도록
                super.catch(exception, host);
                break;
        }

        // default 500 error code
        super.catch(exception, host);
    }
}

// BaseExceptionFilter를 확장해 기본 EceptionFilter 예외 클래스 확장
@Catch(NotFoundException)
export class NotFoundException extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        console.error(exception.message);

        // default 500 error code
        super.catch(exception, host);
    }
}
