import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBlogFirstSubSection } from './PostFirstSubSectionModel';
import { IUser } from '../User';
import {IBlogCategory} from './BlogCategory'
export interface IBlogMainSection extends Document {
    title: string;
    description: string;
    imageUrl: string;
    vadmin:string;
    blogCategory: IBlogCategory | string; 
    user: IUser | string; 
    blogfirstsubsection: IBlogFirstSubSection[] | string[]; // Reference to bloggers
}
// Helper function to slugify category names
const slugifyBlogName = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, ''); // Remove any special characters
  };

const BlogMainSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    slug: { type: String, unique: true },
    blogfirstsubsection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogFirstSubSection' }], // Change this to an array
    vadmin:{ type: String,default:'not-approve'},
    blogCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});
BlogMainSectionSchema.pre('save', function (next) {
    if (this.isModified('title')) {
      this.slug = slugifyBlogName(this.title);
    }
    next();
  });

// Export the model
const BlogMainSection: Model<IBlogMainSection> = mongoose.models.BlogMainSection || mongoose.model<IBlogMainSection>('BlogMainSection', BlogMainSectionSchema);

export default BlogMainSection;
