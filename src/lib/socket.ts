import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const connectAdminSocket = (token: string): Socket => {
  if (socket && socket.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(getBaseUrl(), {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
  });

  return socket;
};

export const disconnectAdminSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getAdminSocket = (): Socket | null => socket;
