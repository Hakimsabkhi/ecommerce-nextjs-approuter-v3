import mongoose, { Schema, Document, model } from 'mongoose';

// Define TypeScript interfaces
export interface Subtitlesubtitle {
  text: string;
  imageUrl?: string; // Image URL for subtitlesubtitle
}

export interface Subtitle {
  subtitle: string;
  subtitlesubtitles: Subtitlesubtitle[];
  imageUrl?: string; // Image URL for subtitle
}

export interface ITitle extends Document {
  title: string;
  subtitles: Subtitle[];
  imageUrl?: string; // Image URL for the main title
}

// Define Mongoose schemas
const SubtitlesubtitleSchema = new Schema<Subtitlesubtitle>({
  text: { type: String, required: true },
  imageUrl: { type: String, required: false }, // Optional field for the image URL
});

const SubtitleSchema = new Schema<Subtitle>({
  subtitle: { type: String, required: true },
  subtitlesubtitles: { type: [SubtitlesubtitleSchema], required: false, default: [] },
  imageUrl: { type: String, required: false }, // Optional field for the image URL
});

const TitleSchema = new Schema<ITitle>(
  {
    title: { type: String, required: true, index: true },
    subtitles: { type: [SubtitleSchema], required: false, default: [] },
    imageUrl: { type: String, required: false }, // Optional field for the main title image URL
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Title = mongoose.models.Title || model<ITitle>('Title', TitleSchema);
