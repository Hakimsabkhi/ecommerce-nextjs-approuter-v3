import mongoose, { Schema, Document,Model, Types} from 'mongoose';
import { IBlogSecondSubSection } from './BlogSecondSubSection';
// Import the IUser interface
export interface IBlogFirstSubSection extends Document {
    title:string;
    description:string;
    imageUrl: string,
    blogsecondsubsection:  IBlogSecondSubSection[]| string[]; 
}

const BlogFirstSubSectionSchema: Schema = new Schema({
    title: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    imageUrl: {
        type: String,
       
    },
    blogsecondsubsection: [{ type: Schema.Types.ObjectId, ref: 'BlogSecondSubSection' }], 
},{ timestamps: true });



const BlogFirstSubSection: Model<IBlogFirstSubSection> = mongoose.models.BlogFirstSubSection || mongoose.model<IBlogFirstSubSection>('BlogFirstSubSection', BlogFirstSubSectionSchema);

export default BlogFirstSubSection;