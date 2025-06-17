import mongoose, { Document, Schema } from 'mongoose';

export interface IPosto extends Document {
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  services: {
    type: string;
    available: boolean;
    waitingTime?: number; // tempo de espera em minutos
  }[];
  specialties: string[];
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  contact: {
    phone: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const postoSchema = new Schema<IPosto>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  services: [{
    type: {
      type: String,
      required: true,
      enum: [
        'atendimento_medico',
        'vacinas',
        'exames',
        'medicamentos',
        'curativos',
        'pronto_atendimento',
        'consultas_agendadas'
      ]
    },
    available: {
      type: Boolean,
      default: true
    },
    waitingTime: {
      type: Number,
      min: 0
    }
  }],
  specialties: [{
    type: String,
    enum: [
      'clinico_geral',
      'pediatria',
      'ginecologia',
      'cardiologia',
      'dermatologia',
      'oftalmologia',
      'ortopedia',
      'neurologia'
    ]
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  openingHours: [{
    day: {
      type: String,
      enum: ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      required: true
    },
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
  }],
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  }
}, {
  timestamps: true
});

// Índice para busca geográfica
postoSchema.index({ location: '2dsphere' });

export const Posto = mongoose.model<IPosto>('Posto', postoSchema); 