import { UserModel } from "../models/user.model";

export class UserRepository {
  async getUserById(id: string) {
    return UserModel.findById(id);
  }

  async getUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async getUserByUsername(username: string) {
    return UserModel.findOne({ username });
  }

  async updateUser(id: string, data: any) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  async searchUsers(query: string, limit = 10) {
    return UserModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).limit(limit);
  }
}

export const userRepository = new UserRepository();
