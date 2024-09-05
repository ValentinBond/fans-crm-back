import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class UsersModel extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;
}
