import mongoose from 'mongoose'

// // 1. chatbot open button logo
// 2. chatbot home logo
// 3. color theme
// 4. margin b and r
// 5. chatbot name
// 6. rounded themes 
// 7. width of panel


const chatbotCustomUi = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    },
    marginBottom: {
        type: Number,
        default: 30
    },
    marginTop: {
        type: Number,
        default: 30
    },
    chatbotName: {
        type: String,
        default: "Task Deno | Filora"
    },
    roundedTheme: {
        type: Number,
        default: 10
    },
    panelWidth: {
        type: Number,
        default: 400
    },
    chatbotLargeLogo: {
        type: String,
        default: "https://placehold.co/600x400"
    },
    chatbotSmallLogo: {
        type: String,
        default: "https://placehold.co/200x200"
    },
    colorTheme: {
        type: String,
        default: "#eeff00"
    }
})