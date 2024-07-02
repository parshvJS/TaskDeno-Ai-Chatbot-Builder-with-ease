import mongoose, { mongo } from "mongoose";


const chatbotProcessQueueSchema = new mongoose.Schema({
    chatbotId: { type: String, required: true },
    instanceId: { type: String, required: true },
    status: { type: String, required: true },
    isDropable: { type: Boolean, required: false }
})

const chatbotProcessQueue =
    mongoose.models.chatbotProcessQueue ||
    mongoose.model("chatbotProcessQueue", chatbotProcessQueueSchema)

export default chatbotProcessQueue;

