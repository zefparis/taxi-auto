import { Server as SocketIOServer } from 'socket.io';
export declare const prisma: any;
declare const app: import("express-serve-static-core").Express;
export declare const io: SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export default app;
