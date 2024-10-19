import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
export interface IBlogCategory extends Document {
  name: string;
  user: IUser | string; // Reference to a User document or User ID
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const BlogCategory: Model<IBlogCategory> = mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory',BlogCategorySchema);

export default BlogCategory;