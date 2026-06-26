import { Injectable } from '@nestjs/common';
import {ClientData} from "./interface";
import {Socket} from "socket.io";


@Injectable()
export class MessageWsService {
  private clients: ClientData[] = [];

  addClient(client: Socket) {
    this.clients[client.id] = client;
  }

  removeClient(id: string) {
    delete this.clients[id];
  }


  getConnectedClients(length?: boolean): string[]|number {
    const ids = Object.keys(this.clients) ?? [];
    if (length) return ids.length;
    return ids;
  }
}
