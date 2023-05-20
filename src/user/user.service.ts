import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const userCreated = new this.userModel(createUserDto);
    return userCreated.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
