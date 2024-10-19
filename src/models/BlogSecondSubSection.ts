import mongoose, { Schema, Document,Model} from 'mongoose';
import { IBlogThirdSubSection } from './BlogThirdSubSection';
// Import the IUser interface
export interface IBlogSecondSubSection extends Document {
    title:string;
    description:string;
    imageUrl: string,
    blogthirdsubsection:  IBlogThirdSubSection[]| string[]; 
}

const BlogSecondSubSectionSchema: Schema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        
    },
    imageUrl: {
        type: String,
      
    },
    blogthirdsubsection: [{ type: Schema.Types.ObjectId, ref: 'BlogThirdSubSection' }], 
},{ timestamps: true });



const BlogSecondSubSection: Model<IBlogSecondSubSection> = mongoose.models.BlogSecondSubSection || mongoose.model<IBlogSecondSubSection>('BlogSecondSubSection', BlogSecondSubSectionSchema);

export default BlogSecondSubSection;