import mongoose, { Schema, Document,Model} from 'mongoose';
// Import the IUser interface
export interface IBlogThirdSubSection extends Document {
    title:string;
    description:string;
    imageUrl: string,
}

const BlogThirdSubSectionSchema: Schema = new Schema({
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



const BlogThirdSubSection: Model<IBlogThirdSubSection> = mongoose.models.BlogThirdSubSection || mongoose.model<IBlogThirdSubSection>('BlogThirdSubSection', BlogThirdSubSectionSchema);

export default BlogThirdSubSection;