import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User as UsersModel } from 'src/users/users.model';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private userModel: typeof UsersModel,
  ) {}

  async create(user: User): Promise<UsersModel> {
    return this.userModel.create({ ...user });
  }

  async findAll(): Promise<UsersModel[]> {
    return this.userModel.findAll();
  }

  async findOneByEmail(email: string): Promise<UsersModel> {
    return this.userModel.findOne({ where: { email } });
  }
}
