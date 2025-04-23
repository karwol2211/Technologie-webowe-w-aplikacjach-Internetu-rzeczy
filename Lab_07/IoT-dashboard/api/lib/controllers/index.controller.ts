import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import { Server } from 'socket.io';
import path from 'path';

class IndexController implements Controller {
    public path = '/';
    public router = Router();
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.serveIndex);
        this.router.get(`${this.path}emit`, this.emitReading);
        this.router.post(`${this.path}sensor`, this.receiveSensorData);
    }

    private emitReading = async (request: Request, response: Response, next: Function) => {
        try {
            this.io.emit("message", 'nowy pomiar');
            response.status(200).json({ res: "ok" });
        } catch (error) {
            console.error("Błąd podczas emisji danych:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    };

    private receiveSensorData = async (request: Request, response: Response) => {
        try {
            const { temperature, humidity, pressure } = request.body;

            const data = {
                temperature,
                humidity,
                pressure,
                timestamp: new Date().toISOString(),
            };

            this.io.emit("sensor-data", data);
            console.log("Otrzymano dane z POST:", data);

            response.status(200).json({ status: "ok", sent: data });
        } catch (error) {
            console.error("Błąd przy POST /sensor:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    };

    private serveIndex = async (request: Request, response: Response) => {
        try {
            response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        } catch (error) {
            console.error("Błąd przy serwowaniu pliku:", error);
            response.status(500).json({ error: "Błąd serwera" });
        }
    };
}

export default IndexController;
