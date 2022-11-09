import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();

// Below routes are protected by the ensureAuthenticated middleware
rentalRoutes.use(ensureAuthenticated);

rentalRoutes.post('/', createRentalController.handle);

// Below routes are protected by the ensureAdmin middleware
rentalRoutes.use(ensureAdmin);

export { rentalRoutes };
