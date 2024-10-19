import mongoose, { Schema, Document,Model, Types} from 'mongoose';
import { ISubbloggers } from './Subbloggers';
// Import the IUser interface
export interface IBlogger extends Document {
    title:string;
    description:string;
    imageUrl: string,
    subbloggers:  ISubbloggers[]| string[]; 
}

const BloggerSchema: Schema = new Schema({
    title: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    imageUrl: {
        type: String,
       
    },
    subbloggers: [{ type: Schema.Types.ObjectId, ref: 'Subbloggers' }], 
},{ timestamps: true });



const Blogger: Model<IBlogger> = mongoose.models.Blogger || mongoose.model<IBlogger>('Blogger', BloggerSchema);

export default Blogger;