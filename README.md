## backend (NestJS)

## 기술스택

-   node (v18.17.1)
-   nestjs
-   prisma (orm)
-   MySQL
-   docker

## db 구조 폴더

```
|- src      // application 소스코드
|- psirma   // prisma모듈은 DB에 대한 인터페이스인 Prisma Client 포함
|-- schema.prisma // DB 스키마(테이블) 정의
|-- migrations    // db 마이그레이션 기록 포함
|-- seed.ts      // 개발 DB에 더미 데이터 시드하는 스크립트 포함
|- docker-compose.yml   // PostgreSQL db에 대한 docker 이미지 정의 포함
```

### docker-compose.yml

nginx proxy가 가동이 안되고 죽으면 안되므로 always로 항상 재시작한다.

```
  nginx:
    restart: always
```

-   no
    어떠한 상황에서도 재시작을 하지 않습니다.
-   always
    항상 재시작을 합니다.
-   on-failure
    on-failure 에러코드와 함꼐 컨테이너가 멈추 었을때만 재시작을 합니다.
-   unless-stopped
    개발자가 임의로 멈추려고 할때 뺴고는 항상 재시작을 합니다.

> docker-compose.yml 작성 후

```
$ docker-compose up

# --build 태그를 넣으면 build되는 과정을 볼 수 있다.
$ docker-compose up --build
```

> docker-compose-dev.yml (개발 환경)

```
 $ docker-compose -f docker-compose-dev.yml up --build -d

```

## ERD

-   식별관계
    -   부모테이블의 기본키를 내려받아 자식테이블의 `(기본키 + 외래키)`를 사용하는 관계
    -   식별관계로 하면 부모테이블의 기본키가 자식테이블로 전파되며 자식테이블의 기본키 컬럼이 점점 늘어남.. 자식은 2개, 손자는 3개 ...
        = 식별관계는 2개 이상의 컬럼을 합해 복합 기본키로 사용하는 경우가 많고, 테이블 구조가 유연하지 못하다
-   비식별관계
    -   부모테이블의 기본키를 받아서 자식테이블의 `외래키`로만 사용하는 관계
        -   필수적 비식별 관계 : 외래키의 NULL 허용하지 않음
        -   선택적 비식별 관계 : 외래키에 NULL을 허용

*   **결론은** 필수적 비식별 관계 추천하고ㄴ
    -   선택적 비식별 관계는 NULL 허용하므로 조인할 경우 `외부 조인`으로 사용!
    -   필수적 비식별 관계는 NOT NULL로 항상 관계가 있다는 것을 보장하므로 `내부 조인`을 사용!

## DB 마이그레이션

prisma 스키마가 정의되면 마이그레이션 실행해서 실제 테이블 생성.
첫번째 마이그레이션 생성하고 실행하려면 아래 명령어 터미널 실행

```
npx prisma migrate dev --name 'init'
```

1. `prisma/migrations` 폴더가 생성되 스키마의 스냅샷을 찍고 migration을 수행하는 데 피룡한 sql명령을 파악
2. migration파일의 sql을 실행해 db의 기본 테이블 생성
3. prisma client 생성. `@prisma/client` 가 dependencies에 추가되어야 함

## CRUD 생성

```
npx nest generate resource

// What name would you like to use for this resource (plural, e.g., "users")?
// articles

// What transport layer do you use?
// REST API

// Would you like to generate CRUD entry points?
// Y

```

## NestJS validation

유효성 검증으로 전송된 모든 데이터의 정확성을 검증하는 게 중요하다. validation 체크로 잘못된 형식의 데이터를 방지하고 API남용을 방지하는데 필요하다.

-   class-validator : 유효성 검증 dacorator제공
-   class-transformer : 입력 데이터를 원하는 형식으로 변환하는 decorator 제공

두 패키지 모두 NestJS파이프와 통합되있다.

```
yarn add class-validator class-transformer
```

ex) article.entity.ts

```
import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(300)
    @ApiProperty({ required: false })
    description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    body: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    published?: boolean = false;
}


```

## NestJS input transform

입력 변환으로 request에 대해 처리되기 전 client보낸 data를 가로채 변환할 수 있는 기술로 data를 적절한 유형으로 형변환하거나, 누락된 필드에 default 값을 준다던가, 입력을 삭제하는 등에 사용하면 유용하다.

## NestJS 에러 핸들링

1. controller 내부 애플리케이션 코드에서 직접 오류 감지

```
    @Get(':id')
    @ApiOkResponse({ type: ArticleEntity })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        // ParseIntPipe로 NestJS파이프로 id를 자동으로 숫자로 변환할 수 있다
        // (Swagger도 string -> number로 변환되어 나타남)
        const article = await this.articlesService.findOne(id);
        if (!article) {
            throw new NotFoundException(`Article with ${id} does not exist`);
        }
        return article;
    }

```

### 직접 넣는 건 지양

-   각 컨트롤러 마다 넣으면 애플리케이션 핵심 논리가 복잡해진다
-   여러 위치에 분산되어 변경하기 어렵다
-   많은 endpoint는 비슷한 오류 처리가 중복되는데 동일한 오류 처리 코드가 중복해서 들어간다

2. 예외 필터를 사용해 애플리케이션 전체에서 처리되지 않은 예외 처리
   따라서 전역에서 예외필터를 생성해서 사용하는걸 지향해야 한다.

-   nest-cli로 filter 클래스 생성

```
npx nest generate filter prisma-client-exception

```

### schema.prisma 추가 후 sql추가 (마이그레이션 DB)

Article 스키마에 User스키마 추가 후 변경 사항 migratino명령 실행

```

# backend .env에서 docker로 띄우면 {container-name}:5432로 바꿔준다 (postgres:5432 -> localhost:5432)

# backend env를 변경후 prisma 실행
npx prisma migrate dev --name "init"

```

위 명령어 실행 후 prisma/migrations 디렉토리로 sql파일 생성 ({숫자}\_init 디렉토리 아래에)

```
migrations/
|- 20240528101323_init
  |- migration.sql
```

### 초기 데이터 밀어넣기

서비스 중인 앱이라면 필요 없지만 새로 서비스를 만드는 단계에서 스키마대로 데이터를 밀어 넣는 경우가 있으므로
prisma/seed.ts로 시드 데이터를 밀어 넣어주는 법

-   package.json에 prisma 추가

```
// package.json

// ...
  "scripts": {
    // ...
  },
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  },
  "jest": {
    // ...
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }

```

```
# seed 넣어주는 명령어
$ npx prisma db seed

```
