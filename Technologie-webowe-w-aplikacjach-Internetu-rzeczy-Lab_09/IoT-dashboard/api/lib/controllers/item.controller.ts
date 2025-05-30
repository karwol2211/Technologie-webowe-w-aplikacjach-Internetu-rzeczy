import { Router, Request, Response } from 'express';

interface Item {
  id: number;
  name: string;
  description: string;
}

interface Controller {
  path: string;
  router: Router;
}

export class ItemController implements Controller {
  public path = '/api/items';
  public router = Router();

  private items: Item[] = [];
  private currentId = 1;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.createItem);
    this.router.get(this.path, this.getAllItems);
    this.router.get(`${this.path}/:id`, this.getItemById);
    this.router.put(`${this.path}/:id`, this.updateItem);
    this.router.delete(`${this.path}/:id`, this.deleteItem);
  }

  private createItem = (req: Request, res: Response) => {
    const { name, description } = req.body;
    const newItem: Item = { id: this.currentId++, name, description };
    this.items.push(newItem);
    res.status(201).json(newItem);
  };

  private getAllItems = (_req: Request, res: Response) => {
    res.json(this.items);
  };

  private getItemById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const item = this.items.find((item) => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  };

  private updateItem = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      this.items[itemIndex] = { id, name, description };
      res.json(this.items[itemIndex]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  };

  private deleteItem = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const deletedItem = this.items.splice(itemIndex, 1)[0];
      res.json(deletedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  };
}
