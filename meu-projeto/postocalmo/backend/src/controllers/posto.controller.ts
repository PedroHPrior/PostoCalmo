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
    const { lat, lng, radius = 5000, specialty, service } = req.query;

    let query: any = {};
    
    // Filtro por localização
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius)
        }
      };
    }

    // Filtro por especialidade
    if (specialty) {
      query.specialties = specialty;
    }

    // Filtro por serviço disponível
    if (service) {
      query['services.type'] = service;
      query['services.available'] = true;
    }

    const postos = await Posto.find(query);
    res.json(postos);
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
      comment
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