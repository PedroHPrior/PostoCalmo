import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/postocalmo');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw new AppError('Erro ao conectar ao banco de dados', 500);
  }
}; 