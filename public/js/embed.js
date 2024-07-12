// public/js/embed.js
(function() {
    function initChatbot(chatbotId) {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        document.body.appendChild(chatbotContainer);

        const iframe = document.createElement('iframe');
        iframe.src = `localhost:8000/chatbot-ui?chatbotId=${chatbotId}`;
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        chatbotContainer.appendChild(iframe);
    }

    const scriptTag = document.getElementById('taskDeno-embed-script');
    const chatbotId = scriptTag.getAttribute('data-id');

    if (chatbotId) {
        initChatbot(chatbotId);
    } else {
        console.error('Chatbot ID not provided');
    }
})();
