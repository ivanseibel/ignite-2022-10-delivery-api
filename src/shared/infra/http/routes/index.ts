import { Router } from 'express';

import { authenticationRoutes } from './authentication.routes';
import { carsRoutes } from './cars.routes';
import { categoriesRoutes } from './categories.routes';
import { rentalRoutes } from './rental.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';

const router = Router();

router.use('/specifications', specificationsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/users', usersRoutes);
router.use('/cars', carsRoutes);
router.use(authenticationRoutes);
router.use('/rentals', rentalRoutes);

export { router };
