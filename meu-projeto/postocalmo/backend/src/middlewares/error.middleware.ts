import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((el: any) => el.message);
    return res.status(400).json({
      status: 'fail',
      message: `Dados inválidos: ${errors.join('. ')}`
    });
  }

  // Erro de duplicação do MongoDB
  if ((err as any).code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: 'Dados duplicados'
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token expirado'
    });
  }

  // Erro interno do servidor
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Algo deu errado'
  });
}; 