import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBlogger } from './Blogger';
import { IUser } from './User';

export interface IBlog extends Document {
    title: string;
    description: string;
    imageUrl: string;
    vadmin:string;
    user: IUser | string; 
    bloggers: IBlogger[] | string[]; // Reference to bloggers
}
// Helper function to slugify category names
const slugifyBlogName = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, ''); // Remove any special characters
  };

const BlogSchema = new mongoose.Schema({
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
    bloggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blogger' }], // Change this to an array
    vadmin:{ type: String,default:'not-approve'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});
BlogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
      this.slug = slugifyBlogName(this.title);
    }
    next();
  });

// Export the model
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
