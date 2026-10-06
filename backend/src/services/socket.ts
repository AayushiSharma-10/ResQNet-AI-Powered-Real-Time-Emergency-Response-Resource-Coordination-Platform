import { Server as SocketIOServer } from 'socket.io';

export let io: SocketIOServer | null = null;

export const setSocketServer = (socketServer: SocketIOServer) => {
  io = socketServer;
};

export const emitToAll = (event: string, payload: unknown) => {
  io?.emit(event, payload);
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  io?.to(userId).emit(event, payload);
};
