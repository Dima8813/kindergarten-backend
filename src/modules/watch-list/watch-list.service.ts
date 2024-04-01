import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { WatchList } from './models/watch-list.model';
import { CreateAssetResponse } from './response';

@Injectable()
export class WatchListService {
  constructor(
    @InjectModel(WatchList)
    private readonly watchListRepository: typeof WatchList,
  ) {}

  async createAsset(user, dto): Promise<CreateAssetResponse> {
    const watchList = {
      userId: user.id,
      name: dto.name,
      assetId: dto.assetId,
    };

    await this.watchListRepository.create(watchList);
    return watchList;
  }

  async deleteAsset(userId: number, assetId: number): Promise<boolean> {
    await this.watchListRepository.destroy({
      where: { id: assetId, userId },
    });
    return true;
  }
}
