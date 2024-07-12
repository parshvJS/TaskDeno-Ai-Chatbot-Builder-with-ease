import { dbConnect } from "@/lib/dbConnect";

// pages/api/chatbot-ui.js
export default function POST(req:Request, res) {
    await dbConnect()
    const { chatbotId } =await req.json;

    if (!chatbotId) {
        return Response.json('Chatbot ID is required');
    }

    // You can replace this HTML with the actual content you want to display
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chatbot UI</title>
            <style>
                body { font-family: Arial, sans-serif; }
                #chatbot { border: 1px solid #ccc; padding: 10px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div id="chatbot">
                <h1>Chatbot ID: ${chatbotId}</h1>
                <p>Welcome to the chatbot interface.</p>
            </div>
        </body>
        </html>
    `;

    return Response.json(htmlContent);
}
