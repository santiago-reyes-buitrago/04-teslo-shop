import {Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import {LoginAuthDto} from "./dto/login-auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
      @InjectRepository(User)private readonly userRepository: Repository<User>
  ) {}

  signUp(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({...createUserDto, password: bcrypt.hashSync(createUserDto.password, 12)});
      return this.userRepository.save(user)
    }catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error executing signUp');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const {email,password} = loginAuthDto;
      const user = await this.userRepository.findOne({where: {email}})
      if (!user) throw new NotFoundException('No se encontro el usuario');
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      return isPasswordValid ? user : null;
    }catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Error executing login');
    }
  }
}
