import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { DUPLICATE_EMAIL_CODE } from 'public/magicNumbers';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  // Logic for register
  // 1. Check for exixsting users
  // 2. Hash the password
  // 3. store the user in the dB
  // 4. generate JWT Token
  // 5. send the token in response
  async createUser(registerDto: RegisterUserDto) {
    try {
      return await this.userModel.create({
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: registerDto.password,
      });
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      const err = error as { code?: number; keyPattern?: { email?: boolean } };
      if (err.code === DUPLICATE_EMAIL_CODE && err?.keyPattern?.email) {
        throw new ConflictException('Email already exists');
      }
      throw new Error('Error creating user', error as Error);
    }
  }
}
