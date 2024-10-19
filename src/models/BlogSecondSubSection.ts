import mongoose, { Schema, Document,Model} from 'mongoose';
// Import the IUser interface
export interface ISubbloggers extends Document {
    title:string;
    description:string;
    imageUrl: string,
}

const SubbloggersSchema: Schema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        
    },
    imageUrl: {
        type: String,
      
    }
},{ timestamps: true });



const Subbloggers: Model<ISubbloggers> = mongoose.models.Subbloggers || mongoose.model<ISubbloggers>('Subbloggers', SubbloggersSchema);

export default Subbloggers;