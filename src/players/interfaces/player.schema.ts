import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    cellPhone: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlPhotoPlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
