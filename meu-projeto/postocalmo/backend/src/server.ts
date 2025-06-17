import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { postoRoutes } from './routes/posto.routes';
import { errorHandler } from './middlewares/error.middleware';
import { connectDB } from './config/database';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
connectDB()
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/postos', postoRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 