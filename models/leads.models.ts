import mongoose, { Schema, Document } from 'mongoose';

interface ILead extends Document {
    email: string;
    phone: string;
    name: string;
    query: string;
    extra: string;
}

const LeadSchema: Schema = new Schema(
    {
        email: { type: String },
        phone: { type: String },
        name: { type: String },
        query: { type: String },
        extra: { type: String },
    },
    { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;