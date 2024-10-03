import mongoose, { Schema, Document,Model} from 'mongoose';
import { IUser } from './User';
import {IAddress} from './Address'

export interface ICompany extends Document {
  name: string;
  addresse:IAddress|string;
  logoUrl?:string;
  email:string;
  phone:number;
  facebook:string;
  linkedin:string;
  instagram:string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  addresse:{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  email:{type: String, required: true },
  phone:{type: Number, required: true },
  facebook:{type: String},
  linkedin:{type: String},
  instagram:{type: String},
  logoUrl: { type: String,required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });



const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;