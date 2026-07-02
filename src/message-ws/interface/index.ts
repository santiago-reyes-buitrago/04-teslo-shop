import {Socket} from "socket.io";

export interface ClientData<T> {
  [id: string]: { socket: Socket, information: T }
}