import { Request, Response, NextFunction } from 'express';
import { Posto } from '../models/Posto';
import { AppError } from '../utils/AppError';

export const createPosto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posto = await Posto.create(req.body);
    res.status(201).json(posto);
  } catch (error) {
    next(error);
  }
};

export const getPostos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        status: 'fail',
        message: 'Latitude e longitude são obrigatórios para buscar postos próximos.'
      });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius)
        }
      }
    };

    // Busca ordenada por distância
    const postos = await Posto.find(query).lean();

    res.json({
      status: 'success',
      results: postos.length,
      postos
    });
  } catch (error) {
    next(error);
  }
};

export const getPosto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posto = await Posto.findById(req.params.id);
    if (!posto) {
      throw new AppError('Posto de saúde não encontrado', 404);
    }
    res.json(posto);
  } catch (error) {
    next(error);
  }
};

export const updatePosto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posto = await Posto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!posto) {
      throw new AppError('Posto de saúde não encontrado', 404);
    }
    res.json(posto);
  } catch (error) {
    next(error);
  }
};

export const deletePosto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posto = await Posto.findByIdAndDelete(req.params.id);
    if (!posto) {
      throw new AppError('Posto de saúde não encontrado', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceType, available, waitingTime } = req.body;
    const posto = await Posto.findById(req.params.id);

    if (!posto) {
      throw new AppError('Posto de saúde não encontrado', 404);
    }

    const serviceIndex = posto.services.findIndex(s => s.type === serviceType);
    if (serviceIndex === -1) {
      throw new AppError('Serviço não encontrado neste posto', 404);
    }

    posto.services[serviceIndex].available = available;
    if (waitingTime !== undefined) {
      posto.services[serviceIndex].waitingTime = waitingTime;
    }

    await posto.save();
    res.json(posto);
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    const posto = await Posto.findById(req.params.id);

    if (!posto) {
      throw new AppError('Posto de saúde não encontrado', 404);
    }

    // Adicionar review
    posto.reviews.push({
      user: req.user._id,
      rating,
      comment,
      createdAt: new Date()
    });

    // Atualizar rating médio
    const totalRating = posto.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    posto.rating = totalRating / posto.reviews.length;

    await posto.save();
    res.json(posto);
  } catch (error) {
    next(error);
  }
}; 