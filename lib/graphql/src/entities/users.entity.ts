import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class UserEntity implements User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @IsNotEmpty()
  @Index({ unique: true })
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
