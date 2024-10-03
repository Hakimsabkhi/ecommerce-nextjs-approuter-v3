import mongoose ,{Document,Model}from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
import { ICategory } from './Category';  
import { IBrand } from './Brand';
export interface IProduct extends Document {
  name: string;
  info:string;
  description?: string;
  ref:string;
  price: number;
  imageUrl?: string;
  images?: string []; 
  material?:string;
  color?:string;
  dimensions?:string;
  warranty?:string,
  category: ICategory | string;//Reference to a category document or category ID
  brand: IBrand | string;//Reference to a brand document or brand ID 
  stock: number;
  user: IUser | string; // Reference to a User document or User ID
  discount?: number;
  weight?:string;
  status:string;
  statuspage:string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  info:{ type: String, required: true },
  description: { type: String },
  ref: { type: String, required: true },
  material:{ type: String},
  dimensions:{ type: String },
  color:{type:String},
  warranty:{ type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  stock:  { type: Number, required: true },
  price:  { type: Number, required: true },
  discount: { type: Number},
  weight:{type:String},
  status: { type: String, default: 'in stock' },
  statuspage:{ type: String,default:''},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String },
  images: [{ type: String }], 
},{ timestamps: true });


const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
  export default Product