
(function () {
    function initChatbot(chatbotId) {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';
        document.body.appendChild(chatbotContainer);
        chatbotContainer.style.right = "0";
        chatbotContainer.style.bottom = "0";
        chatbotContainer.style.width = "350px"; // Adjust width as needed
        chatbotContainer.style.height = "500px"; // Adjust height as needed
        chatbotContainer.style.width = "100%";
        chatbotContainer.style.height = "100%";
        chatbotContainer.style.position = "absolute";
        chatbotContainer.style.zIndex = "2147483647";
        // Loading indicator
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Loading chat...';
        chatbotContainer.appendChild(loadingText);

        const iframe = document.createElement('iframe');
        localStorage.setItem('chatbotId', chatbotId);
        iframe.src = `http://localhost:3000/api/chatbot-ui?chatbotId=${chatbotId}`;
        iframe.style.width = '100%';
        iframe.style.zIndex = '2147483647';
        iframe.style.height = '100%';
        iframe.style.position = 'fixed';
        iframe.style.border = 'none';
        iframe.onload = function () {
            loadingText.style.display = 'none'; // Hide loading text when iframe is loaded
        };
        iframe.onerror = function () {
            loadingText.textContent = 'Failed to load chat.'; // Display error message
        };

        chatbotContainer.appendChild(iframe);
    }

    const scriptTag = document.getElementById('taskDeno-embed-script');
    const chatbotId = scriptTag.getAttribute('data-id');
    console.log('Script tag:', scriptTag);
    if (chatbotId) {
        console.log('Chatbot ID:', chatbotId);
        initChatbot(chatbotId);
    } else {
        console.error('Chatbot ID not provided');
    }
})();