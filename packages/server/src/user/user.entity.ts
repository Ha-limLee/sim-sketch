import { Property, Entity, Unique, PrimaryKey } from '@mikro-orm/core';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  @Unique()
  @IsEmail()
  email: string;

  @Property()
  password: string;

  @Property({ nullable: true })
  profile_image: string | undefined;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor({
    name,
    email,
    password,
    profile_image,
  }: {
    name: string;
    email: string;
    password: string;
    profile_image: string | undefined;
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profile_image = profile_image;
  }
}
