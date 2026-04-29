import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { uri, synchronize, logging } = configService.database;
        return {
          type: 'postgres',
          url: uri,
          synchronize,
          logging,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
