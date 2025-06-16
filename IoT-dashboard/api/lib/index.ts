import App from './app';
import { createControllers } from './factories/controllerFactory';

const controllers = createControllers();
const app = new App(controllers);
app.listen();

