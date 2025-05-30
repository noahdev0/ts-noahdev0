import { Authorized, Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { AuthRepository } from '@repositories/auth.repository';

@Resolver()
export class AuthResolver extends AuthRepository {
  @Mutation(() => UserEntity, {
    description: 'User signup',
  })
  async signup(@Arg('userData') userData: CreateUserDto): Promise<UserEntity> {
    const user = await this.userSignUp(userData);
    return user;
  }

  @Mutation(() => UserEntity, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: CreateUserDto): Promise<UserEntity> {
    const { findUser } = await this.userLogIn(userData);
    return findUser;
  }

  @Authorized()
  @Mutation(() => UserEntity, {
    description: 'User logout',
  })
  async logout(@Ctx('user') userData: UserEntity): Promise<UserEntity> {
    const user = await this.userLogOut(userData);
    return user;
  }
}
