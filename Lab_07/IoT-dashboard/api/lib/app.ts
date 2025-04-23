import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { config } from './config';
import Controller from "./interfaces/controller.interface";

class App {
  public app: express.Application;
  private server: http.Server;
  public io: Server;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.server = http.createServer(this.app);

    this.initializeMiddlewares();
    this.initializeSocket();
    this.initializeControllers(controllers);
    this.connectToDatabase();
  }

  private initializeSocket(): void {
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
      }
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`Nowe połączenie: ${socket.id}`);

      socket.on("message", (data: string) => {
        console.log(`Wiadomość od ${socket.id}: ${data}`);
        this.io.emit("message", data);
      });

      socket.on("disconnect", () => {
        console.log(`Rozłączono: ${socket.id}`);
      });
    });

    setInterval(() => {
      const data = {
        temperature: (Math.random() * 5 + 20).toFixed(1),
        humidity: Math.floor(Math.random() * 20 + 40),
        pressure: Math.floor(Math.random() * 20 + 990),
        timestamp: new Date().toISOString(),
      };

      this.io.emit("sensor-data", data);
      console.log("Wysłano dane:", data);
    }, 15000);
  }

  public getIo(): Server {
    return this.io;
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen(): void {
    this.server.listen(config.port, () => {
      console.log(`App + WebSocket listening on port ${config.port}`);
    });
  }

  private async connectToDatabase(): Promise<void> {
  }
}

export default App;
