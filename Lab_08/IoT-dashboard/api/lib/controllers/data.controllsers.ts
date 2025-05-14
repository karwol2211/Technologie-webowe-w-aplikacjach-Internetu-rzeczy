import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private readings: number[] = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id`, this.getReadingById);
        this.router.get(`${this.path}/:id/latest`, this.getLatestReadingById);
        this.router.get(`${this.path}/:id/:num`, this.getReadingsRangeById);
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAllData);
        this.router.delete(`${this.path}/:id`, this.deleteDataById);
    }

    private getLatestReadingsFromAllDevices = async (req: Request, res: Response) => {
        res.status(200).json(this.readings);
    }

    private getReadingById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id < 0 || id >= this.readings.length) {
            return res.status(404).json({ message: 'Nie znaleziono odczytu o podanym ID' });
        }
        res.status(200).json({ value: this.readings[id] });
    }

    private getLatestReadingById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id < 0 || id >= this.readings.length) {
            return res.status(404).json({ message: 'Nie znaleziono odczytu o podanym ID' });
        }
        const max = Math.max(...this.readings);
        res.status(200).json({ maxValue: max });
    }

    private getReadingsRangeById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const num = parseInt(req.params.num);
        if (isNaN(id) || isNaN(num) || id < 0 || id >= this.readings.length) {
            return res.status(400).json({ message: 'Błędne dane wejściowe' });
        }
        const sliced = this.readings.slice(id, id + num);
        res.status(200).json(sliced);
    }

    private addData = async (req: Request, res: Response) => {
        const { elem } = req.body;
        if (typeof elem !== 'number') {
            return res.status(400).json({ error: "'elem' musi być liczbą" });
        }
        this.readings.push(elem);
        res.status(200).json(this.readings);
    }

    private deleteAllData = async (req: Request, res: Response) => {
        this.readings = [];
        res.status(200).json({ message: 'Wszystkie dane zostały usunięte' });
    }

    private deleteDataById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id < 0 || id >= this.readings.length) {
            return res.status(404).json({ message: 'Nie znaleziono odczytu do usunięcia' });
        }
        this.readings.splice(id, 1);
        res.status(200).json({ message: `Usunięto odczyt o indeksie ${id}` });
    }
}

export default DataController;
