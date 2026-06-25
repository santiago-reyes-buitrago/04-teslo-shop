import {Socket} from "socket.io";

export interface ClientData {
  [id: string]: Socket
}