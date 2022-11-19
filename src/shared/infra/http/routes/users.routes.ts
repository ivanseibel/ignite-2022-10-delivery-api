import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ResetUserPasswordController } from '@modules/accounts/useCases/resetUserPassword/ResetUserPasswordController';
import { SendForgottenPasswordMailController } from '@modules/accounts/useCases/sendForgottenPasswordMail/SendForgottenPasswordMailController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { UserProfileController } from '@modules/accounts/useCases/userProfile/UserProfileController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const sendForgottenPasswordMailController =
  new SendForgottenPasswordMailController();
const resetUserPasswordController = new ResetUserPasswordController();
const userProfileController = new UserProfileController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);
usersRoutes.post(
  '/forgot-password',
  sendForgottenPasswordMailController.handle
);
usersRoutes.post('/reset-password', resetUserPasswordController.handle);
usersRoutes.get('/profile', ensureAuthenticated, userProfileController.handle);

export { usersRoutes };
