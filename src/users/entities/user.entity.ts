import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
    // password를 controller의 router핸들러가 User prisma client에서 생성된 유형을 반환하므로
    // ClassSerializerInterceptor는 @Exclude() 데코레이터만 작동시킨다.
    // 그래서 UserEntity대신 password빼고 return하도록 해야한다.
    constructor(partial: Partial<UserEntity>) {
        // Object.assin으로 객체 속성을 인스턴스 partial에 복사
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @Exclude()
    password: string;
}
