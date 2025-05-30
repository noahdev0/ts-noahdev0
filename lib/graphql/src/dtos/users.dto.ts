import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { UserEntity } from '@entities/users.entity';

@InputType()
export class CreateUserDto implements Partial<UserEntity> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  password: string;
}

@InputType()
export class UpdateUserDto implements Partial<UserEntity> {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  password: string;
}
