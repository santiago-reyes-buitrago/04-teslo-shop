import {Injectable} from '@nestjs/common';
import {ClientData} from "./interface";
import {Socket} from "socket.io";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../auth/entities/user.entity";
import {Repository} from "typeorm";


@Injectable()
export class MessageWsService {
  private clients: ClientData<User>[] = [];

  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async addClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');
    this.clients[client.id] = {Socket: client, information: user};
  }

  removeClient(id: string) {
    delete this.clients[id];
  }


  getConnectedClients(length?: boolean): string[] | number {
    const ids = Object.keys(this.clients) ?? [];
    if (length) return ids.length;
    return ids;
  }
}
