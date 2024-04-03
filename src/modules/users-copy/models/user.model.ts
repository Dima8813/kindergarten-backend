import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { WatchList } from '../../watch-list/models/watch-list.model';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  surname: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => WatchList)
  watchList: WatchList[];
}
