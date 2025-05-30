import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
import { IData } from '../modules/models/data.model';


interface Item {
    id: number;
    name: string;
    description: string;
  }

class DataController implements Controller {
    private items: Item[] = [];
   public path = '/api/data';
   public router = Router();
   private dataService = new DataService();


   constructor() {
       this.initializeRoutes();
   }


   private initializeRoutes() {
    this.router.get(`${this.path}/get`, this.getAll);

   }

   private getAll = async (req: Request, res: Response) => {
    res.json(await this.dataService.getAll());
  };
}


export default DataController;