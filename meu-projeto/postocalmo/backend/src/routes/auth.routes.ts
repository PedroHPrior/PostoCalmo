import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema } from '../middlewares/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export const authRoutes = router; 