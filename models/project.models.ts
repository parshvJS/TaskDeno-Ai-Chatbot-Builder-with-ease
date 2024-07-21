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
        type: {
            type: Array,
            default: function (){
                return () => [{
                    id: 'start101',
                    type: 'startNode',
                    data: { label: 'Start' },
                    position: {
                        x: 518,
                        y: 246
                    },
                }]
            }
        }
    },
    edges: {
        type: Array,
        default: []
    },
    variables: {
        type: {
            type: Array,
            default: () => ['user_name', 'user_location', 'user_contact_no']
        }
    },
    aiPrompts: {
        type: Array,
        default: []
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
    embedId: {
        type: Number
    }
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;