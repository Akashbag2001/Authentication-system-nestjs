import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto/registerUser.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'public/magicNumbers';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerDto: RegisterUserDto) {
    // console.log(registerDto);
    const saltRound = SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRound);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    console.log('users', user);
    console.log('token', token);
    return {
      message: 'User created successfully',
      user: user,
      access_token: token,
    };
  }
}
