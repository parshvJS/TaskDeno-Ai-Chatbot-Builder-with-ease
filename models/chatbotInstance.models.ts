import mongoose from "mongoose";

const chatBotInstance = new mongoose.Schema({
    chatbotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    },
    instanceId: {
        type: String,
    },
    conversation: {
        type: [],
    },
    initial_variables: {
        type: [],
    },
    redirected: {
        type: Boolean,
        default: false
    },
    hitsToAi: {
        type: Number,
        default: 0
    },
})

const ChatbotInstance = mongoose.models.ChatbotInstance || mongoose.model("ChatbotInstance", chatBotInstance);
export default ChatbotInstance;