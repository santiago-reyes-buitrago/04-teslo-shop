import {Socket} from "socket.io";

export interface InformationSocketClient<T> {
  socket: Socket,
  information: T
}

export interface ClientData<T> {
  [id: string]: InformationSocketClient<T>
}

export type IErrors = Record<number, (...params: any[]) => boolean|void>;