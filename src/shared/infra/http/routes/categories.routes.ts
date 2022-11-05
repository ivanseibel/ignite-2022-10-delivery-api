import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/importCategory/ImportCategoryController';
import { ListCategoriesController } from '@modules/cars/useCases/listCategories/ListCategoriesController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

import { ensureAdmin } from '../middlewares/ensureAdmin';

const categoriesRoutes = Router();

const upload = multer({
  dest: './tmp',
});

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoryController = new ImportCategoryController();

// Below routes are protected by the ensureAuthenticated middleware
categoriesRoutes.use(ensureAuthenticated);

categoriesRoutes.get('/', listCategoriesController.handle);

// Below routes are protected by the ensureAdmin middleware
categoriesRoutes.use(ensureAdmin);

categoriesRoutes.post('/', createCategoryController.handle);

categoriesRoutes.post(
  '/import',
  upload.single('file'),
  importCategoryController.handle
);

export { categoriesRoutes };
