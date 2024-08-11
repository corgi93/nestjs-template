import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Global()
@Module({})
export class CommonModule implements NestModule {
    // Global Middleware
    public configure(consumer: MiddlewareConsumer): void {
        // apply안에 middleware추가
        console.log('middleware...');
        consumer.apply().forRoutes('*');
    }
}
