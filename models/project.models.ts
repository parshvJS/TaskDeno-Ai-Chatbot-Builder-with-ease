import mongoose from "mongoose";
import { boolean, number, string } from "zod";
const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nodes: {
        type: [],

    },
    edges: {
        type: [],
    },
    variables: {
        type: [],
        default: ['user_name', 'user_location', 'user_contact_no']
    },
    aiPrompts: {
        type: [],
    },
    aiModel: {
        type: String,
        default: "GPT-3.5"
    },
    scriptTag: {
        type: String,
    },
    isScriptTagAvailable: {
        type: Boolean,
        default: false
    },
    colorTheme: {
        type: String,
        default: "#EEFF00"
    },
    marginBottom: {
        type: Number,
        default: 30
    },
    marginRight: {
        type: Number,
        default: 30
    },
    userChatbotName: {
        type: String,
        default: "Task Deno | Firola"
    },
    userChatbotImage: {
        type: String,
        default: "https://res.cloudinary.com/dwhmpzqzq/image/upload/v1720679740/a7wafzvm4qthwpoegmh1.png"
    },
    embedId:{
        type:Number
    }
}, { timestamps: true })

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project