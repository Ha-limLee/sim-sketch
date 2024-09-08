import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const email = createUserDto.email;
    const isAlreadyCreated = await this.userRepository.findOne({ email });

    if (!isAlreadyCreated) {
      const user = new User({
        name: createUserDto.name,
        email,
        password: createUserDto.password,
        profile_image: createUserDto.profile_image,
      });
      await this.em.persistAndFlush(user);
      return user;
    }
    return null;
  }
}
