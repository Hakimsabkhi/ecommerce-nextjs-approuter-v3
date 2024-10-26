import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBlogFirstSubSection } from './BlogFirstSubSection';
import { IUser } from './User';

export interface IBlogMainSection extends Document {
    title?: string;
    description?: string;
    imageUrl?: string;
    vadmin?: string;
    user?: IUser | string;
    blogfirstsubsection?: IBlogFirstSubSection[] | string[];
}

const BlogMainSectionSchema = new mongoose.Schema({
  title: { type: String }, 
  description: { type: String },
  imageUrl: { type: String },
  slug: { type: String, }, 
  blogfirstsubsection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogFirstSubSection' }],
  vadmin: { type: String, default: 'not-approve' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Helper function to create a slug from the title
const slugifyBlogName = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, ''); // Remove special characters
};

BlogMainSectionSchema.pre('save', async function (next) {
    if (this.isModified('title') && this.title) {
        let slug = slugifyBlogName(this.title);
        
        // Check for existing slugs in the database
        let existing = await mongoose.models.BlogMainSection.findOne({ slug });
        let count = 1;

        while (existing) {
            slug = `${slugifyBlogName(this.title)}-${count}`;
            existing = await mongoose.models.BlogMainSection.findOne({ slug });
            count++;
        }

    
        this.slug = slug;
    }
    next();
});

const BlogMainSection: Model<IBlogMainSection> = mongoose.models.BlogMainSection || mongoose.model<IBlogMainSection>('BlogMainSection', BlogMainSectionSchema);

export default BlogMainSection;
