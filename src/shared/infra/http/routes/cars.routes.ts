import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

import { ensureAdmin } from '../middlewares/ensureAdmin';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();

// Below routes are protected by the ensureAuthenticated middleware
carsRoutes.use(ensureAuthenticated);

carsRoutes.get('/available', listAvailableCarsController.handle);

// Below routes are protected by the ensureAdmin middleware
carsRoutes.use(ensureAdmin);

carsRoutes.post('/', createCarController.handle);

export { carsRoutes };
