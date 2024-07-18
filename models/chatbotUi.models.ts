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
    marginRight: {
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
    },
    welcomText: {
        type: String,
        default: "Hello, I am your assistant. How can I help you today?"
    },
    faq: {
        type: [],
        default: [
            {
                question: "Where can I contact you?",
                previewAnswer: "You can contact us through the following channels:",
                wholeAnswer: "<p>You can contact us through the following channels:</p><ul><li><b>Email:</b> find in footer</li><li><b>Phone:</b> find in footer</li><li><b>Live Chat:</b> Visit our website and click on the live chat button</li></ul>"
            },
            {
                question: "What are your working hours?",
                previewAnswer: "Our working hours are as follows:",
                wholeAnswer: "<p>Our working hours are as follows:</p><ul><li><b>Monday - Friday:</b> 9:00 AM - 5:00 PM</li><li><b>Saturday:</b> 9:00 AM - 1:00 PM</li><li><b>Sunday:</b> Closed</li></ul>"
            },
            {
                question: "Do you offer refunds?",
                previewAnswer: "Yes, we offer refunds under the following conditions:",
                wholeAnswer: "<p>Yes, we offer refunds under the following conditions:</p><ul><li><b>Unused Services:</b> Refunds are available for unused services within 30 days of purchase.</li><li><b>Product Defects:</b> Refunds are available for products with defects within 14 days of purchase.</li><li><b>Change of Mind:</b> Refunds are not available for change of mind.</li></ul>"
            }
        ]
    },
    contact: {
        type: [],
        default: []
    }
})

const ChatbotUi = mongoose.models.ChatbotUi || mongoose.model("ChatbotUi", chatbotCustomUi);

export default ChatbotUi