import { Router } from 'express';
import {
  createPosto,
  getPostos,
  getPosto,
  updatePosto,
  deletePosto,
  addReview
} from '../controllers/posto.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/', getPostos);
router.get('/:id', getPosto);

// Rotas protegidas
router.use(protect);

router.post('/', restrictTo('admin'), createPosto);
router.patch('/:id', restrictTo('admin'), updatePosto);
router.delete('/:id', restrictTo('admin'), deletePosto);
router.post('/:id/reviews', addReview);

export const postoRoutes = router; 