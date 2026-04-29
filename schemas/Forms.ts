import { Document, Schema, model } from 'mongoose';

export interface IForm extends Document {
  id: string;
  family_id: string;
  dt_coleta: string;
  municipality: string;
  has_CadUnico: string;
  dt_CadUnico: string;
  PBF_value: string;
  month_from_last_CadUnico: string;
  R1: string;
  R2: string;
  E1: string;
  E2: string;
  I1: string;
  I2: string;
  I3: string;
  I4: string;
  S1: string;
  N1: string;
  total_IPM: string;
  submission_date: string;
  submited_by: string;
  // ... outros campos do get_data()
}

const FormSchema = new Schema<IForm>({
  family_id: { type: String, required: true, index: true },
  dt_coleta: String,
  municipality: { type: String, index: true },
  has_CadUnico: String,
  dt_CadUnico: String,
  PBF_value: String,
  month_from_last_CadUnico: String,
  R1: String,
  R2: String,
  E1: String,
  E2: String,
  I1: String,
  I2: String,
  I3: String,
  I4: String,
  S1: String,
  N1: String,
  total_IPM: { type: String, index: true },
  // Adicione TODOS os campos de get_data()
}, {
  collection: 'forms',
  timestamps: true  // createdAt/updatedAt auto
});

// Índices Kobotoolbox
FormSchema.index({ municipality: 1, total_IPM: 1 });
FormSchema.index({ has_CadUnico: 1 });

export const FormModel = model<IForm>('Form', FormSchema);
