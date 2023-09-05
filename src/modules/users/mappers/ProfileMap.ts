import { User } from '../entities/User'

export class ProfileMap {
  static toDTO({ id, name, email, createdAt, updatedAt }: User) {
    return {
      id,
      name,
      email,
      createdAt,
      updatedAt
    }
  }
}
