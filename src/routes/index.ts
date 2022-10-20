import { Router } from 'express';

import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes } from './specifications.routes';

const router = Router();

router.use('/specifications', specificationsRoutes);
router.use('/categories', categoriesRoutes);

export { router };
