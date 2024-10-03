import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
export interface ICategory extends Document {
  name: string;
  logoUrl?:string;
  imageUrl?: string;
  bannerUrl?:string;
  user: IUser | string; // Reference to a User document or User ID
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  imageUrl: { type: String },
  bannerUrl:{type:String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;