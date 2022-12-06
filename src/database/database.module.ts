import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'admin',
      database: 'test',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
