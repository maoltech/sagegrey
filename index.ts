import express, {NextFunction} from 'express';
import dotenv from 'dotenv';
import {APPPORT} from './constants/environments';
import { routes } from './router/index.router';
import { databaseConfig } from './config/database.config';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import { authMiddleWare } from './middleware/auth.middleware';
import { handleConnection } from './sockets/connection';

dotenv.config();

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

const port = APPPORT || 3000;

app.use(express.json());

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);

app.use(cors());

// io.use((socket, next:any) => {
  
//   authMiddleWare.socketAuthMiddleware(socket, next);

// })

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  handleConnection(io, socket);

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id} due to ${reason}`);
  });
});

app.use('/api/v1', routes.router);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
// const applisten = app.listen(port);
// if(applisten){
//   console.log(`Server is running on ${port}`);
// };
databaseConfig.mongodbConnection();
