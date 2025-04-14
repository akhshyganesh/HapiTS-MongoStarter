import { User, IUser } from '../models/user.model';

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserService {
  public async createUser(userData: Partial<IUser>): Promise<UserResponse> {
    const user = new User(userData);
    await user.save();

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    };
  }

  public async getUsers(): Promise<UserResponse[]> {
    const users = await User.find().select('-password');

    return users.map((user) => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  public async getUserById(userId: string): Promise<UserResponse | null> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async updateUser(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<UserResponse | null> {
    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select(
      '-password',
    );

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return result !== null;
  }
}
