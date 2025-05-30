import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { UserRepository } from '@repositories/users.repository';

@Resolver()
export class UserResolver extends UserRepository {
  @Query(() => [UserEntity], {
    description: 'User find list',
  })
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userFindAll();
    return users;
  }

  @Query(() => UserEntity, {
    description: 'User find by id',
  })
  async getUserById(@Arg('userId') userId: number): Promise<UserEntity> {
    const user = await this.userFindById(userId);
    return user;
  }

  @Mutation(() => UserEntity, {
    description: 'User create',
  })
  async createUser(@Arg('userData') userData: CreateUserDto): Promise<UserEntity> {
    const user = await this.userCreate(userData);
    return user;
  }

  @Mutation(() => UserEntity, {
    description: 'User update',
  })
  async updateUser(@Arg('userId') userId: number, @Arg('userData') userData: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userUpdate(userId, userData);
    return user;
  }

  @Mutation(() => UserEntity, {
    description: 'User delete',
  })
  async deleteUser(@Arg('userId') userId: number): Promise<UserEntity> {
    const user = await this.userDelete(userId);
    return user;
  }
}
