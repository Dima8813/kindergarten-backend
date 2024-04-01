import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { WatchListController } from './watch-list.controller';
import { WatchListService } from './watch-list.service';
import { WatchList } from './models/watch-list.model';

@Module({
  imports: [SequelizeModule.forFeature([WatchList])],
  controllers: [WatchListController],
  providers: [WatchListService],
})
export class WatchListModule {}
