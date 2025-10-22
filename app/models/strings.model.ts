import mongoose, { Schema, model } from 'mongoose';

export interface iStringRecord extends mongoose.Document {
  id: string; // sha256 hash
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };
  created_at: Date;
}

const StringRecordSchema = new Schema<iStringRecord>({
  id: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
  properties: {
    length: { type: Number, required: true },
    is_palindrome: { type: Boolean, required: true },
    unique_characters: { type: Number, required: true },
    word_count: { type: Number, required: true },
    sha256_hash: { type: String, required: true },
    character_frequency_map: { type: Schema.Types.Mixed, required: true },
  },
  created_at: { type: Date, required: true, default: () => new Date() },
});


const StringModel = model<iStringRecord>('StringRecord', StringRecordSchema);

export default StringModel;
