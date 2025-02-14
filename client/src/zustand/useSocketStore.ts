import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { shallow } from "zustand/shallow";

export interface SocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
}));

