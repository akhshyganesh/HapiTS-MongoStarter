import User, { IUser } from '@/models/user.model';

class UserService {
  async createUser(data: IUser): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async getUsers(): Promise<IUser[]> {
    return User.find();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }
}

export default new UserService();
