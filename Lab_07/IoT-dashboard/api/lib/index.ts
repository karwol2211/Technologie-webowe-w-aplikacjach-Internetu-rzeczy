import App from './app';
import IndexController from "./controllers/index.controller";
import DataController from './controllers/Datacontroller';
import ItemController from './controllers/item.controller';

const app: App = new App([]);
const io = app.getIo();

const controllers = [
  new IndexController(io),
  new DataController(),
  new ItemController(io),
];

controllers.forEach((controller) => {
  app.app.use("/", controller.router);
});

app.listen();
