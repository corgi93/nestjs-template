import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

/**
 * POST,UPDATE 요청시 데이터 삽입 DTO, 수정 DTO를 일반적으로 만드는데
 * 일반적인 경우 수정DTO는 생성DTO에 종속되는데 PartialType을 써서
 * 수정 DTO가  생성DTO에 들어있는 개체에 포함될 때 PartialType으로 재사용 가능
 */

// npx generate resource로 생성시 mappted-types로 PartialType이 생성되므로 @nestjs/swagger 변경해줘야함

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
