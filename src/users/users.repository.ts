import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(payload: Partial<User>) {
    return this.userModel.create(payload);
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  findAll() {
    return this.userModel.find();
  }

  update(id: string, payload: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }

  delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
