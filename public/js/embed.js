// public/js/embed.js
(function () {
    function initChatbot(chatbotId) {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        document.body.appendChild(chatbotContainer);
        console.log("hellow world");
        const iframe = document.createElement('iframe');
        iframe.src = `http://localhost:8000/chatbot-ui`;
        console.log("hellow world", iframe);
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        iframe.style.position='fixed';
        iframe.style.zIndex=1000;
        iframe.style.bottom='20px';
        iframe.style.bottom='10px';

        // position: fixed; z-index: 2147483647; bottom: 20px; right: 20px;
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
