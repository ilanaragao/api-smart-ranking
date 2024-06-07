import { Document } from 'mongoose';

export interface Player extends Document {
  readonly _id: string;
  readonly cellPhone: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlPhotoPlayer: string;
}
