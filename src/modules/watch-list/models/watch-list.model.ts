import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { User } from '../../users/models/user.model';

@Table
export class WatchList extends Model {
  @ForeignKey(() => User)
  userId: User;

  @Column
  name: string;

  @Column
  assetId: string;
}
