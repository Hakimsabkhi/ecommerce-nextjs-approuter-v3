import mongoose, { Schema, Document,Model} from 'mongoose';

// Import the IUser interface
export interface IBlogSecondSubSection extends Document {
    title:string;
    description:string;
    imageUrl: string,
    
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
   
},{ timestamps: true });



const BlogSecondSubSection: Model<IBlogSecondSubSection> = mongoose.models.BlogSecondSubSection || mongoose.model<IBlogSecondSubSection>('BlogSecondSubSection', BlogSecondSubSectionSchema);

export default BlogSecondSubSection;