import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User as UsersModel } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { email, firstName, lastName } = user;
      return {
        email,
        firstName,
        lastName,
      };
    }
    return null;
  }

  async login(user: UsersModel) {
    const payload = {
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '3m',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      +this.configService.get('SALT'),
    );
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(String(refreshToken).trim(), {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findOneByEmail(payload.email);
      if (user) {
        const accessToken = this.jwtService.sign(
          {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '3m',
          },
        );
        return { accessToken };
      }
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}
