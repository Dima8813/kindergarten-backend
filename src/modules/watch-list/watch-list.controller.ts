import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { WatchListDTO } from './dto';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAssetResponse } from './response';

@Controller('watchLists')
export class WatchListController {
  constructor(private readonly watchListService: WatchListService) {}

  @ApiTags('Assets')
  @ApiResponse({ status: 201, type: CreateAssetResponse })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createAsset(
    @Body() assetDto: WatchListDTO,
    @Req() request,
  ): Promise<CreateAssetResponse> {
    const user = request.user;
    return this.watchListService.createAsset(user, assetDto);
  }

  @ApiTags('Assets')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteAsset(@Query('id') assetId: number, @Req() request): Promise<boolean> {
    const { id } = request.user;
    return this.watchListService.deleteAsset(id, assetId);
  }
}
