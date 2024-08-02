<script>
var defaultFaq = [
    {
        header: "Working with Us",
        preview: "Questions related to working with us.",
        qna: [
            {
                question: "How can I apply for a job?",
                previewAnswer: "Visit our Careers page for current openings.",
                wholeAnswer: "<p>Visit our <a href='/careers'>Careers page</a> to view current job openings and submit your application online.</p>"
            },
            {
                question: "What are the working hours?",
                previewAnswer: "Our standard working hours are 9 AM to 5 PM.",
                wholeAnswer: "<p>Our standard working hours are from 9 AM to 5 PM, Monday to Friday. Weekend work is rare and only in critical situations.</p>"
            }
        ]
    },
    {
        header: "Product Information",
        preview: "Learn more about our products.",
        qna: [
            {
                question: "Do you offer product warranties?",
                previewAnswer: "Yes, all products come with a 1-year warranty.",
                wholeAnswer: "<p>Yes, all our products come with a 1-year warranty covering manufacturing defects. For more details, visit our Warranty section.</p>"
            },
            {
                question: "Can I request a product demo?",
                previewAnswer: "Absolutely, product demos can be scheduled with our team.",
                wholeAnswer: "<p>Absolutely, we encourage you to schedule a product demo with our team. Please contact our sales department to arrange a demo at your convenience.</p>"
            }
        ]
    },
    {
        header: "Ordering & Shipping",
        preview: "Information on placing orders and shipping.",
        qna: [
            {
                question: "How do I track my order?",
                previewAnswer: "Use the tracking link provided in your confirmation email.",
                wholeAnswer: "<p>Once your order is shipped, you'll receive a confirmation email with a tracking link. Use this link to track your order's progress.</p>"
            },
            {
                question: "Do you ship internationally?",
                previewAnswer: "Yes, we ship to select countries outside of our base.",
                wholeAnswer: "<p>Yes, we offer international shipping to select countries. Please check our Shipping Policy for more details and applicable fees.</p>"
            }
        ]
    },
    {
        header: "Returns & Refunds",
        preview: "How to handle returns and refunds.",
        qna: [
            {
                question: "What is your return policy?",
                previewAnswer: "Items can be returned within 30 days of receipt.",
                wholeAnswer: "<p>Items can be returned within 30 days of receipt, provided they are in their original condition. For more information, please visit our Returns Policy page.</p>"
            },
            {
                question: "How do I request a refund?",
                previewAnswer: "Contact our support team with your order details.",
                wholeAnswer: "<p>To request a refund, please contact our support team with your order details. Refunds are processed within 5-7 business days after receiving the returned items.</p>"
            }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function () {
    var chatbotTrigger = document.getElementById('chatbot-trigger');
    var chatbotPanel = document.getElementById('chatbot-panel');
    var faqAdd = document.getElementById("faq-showcase");
    
    chatbotTrigger.addEventListener('click', function () {
        const chatbotChat = document.getElementById('chatbot-panel-2');
        if(chatbotChat.style.display === "block") {
            saveAndDisconnect();
        } else {
            chatbotPanel.style.display = chatbotPanel.style.display === 'block' ? 'none' : 'block';
            console.log(chatbotPanel, "is showing");
        }
    });

    // FAQ Section
    var faqCollection = defaultFaq;
    var faqCollectionLength = document.getElementById('faq-collection-length');
    faqCollectionLength.innerHTML = faqCollection.length + " Collection";

    faqCollection.forEach((faq, index) => {
        var faqDiv = document.createElement('div');
        faqDiv.classList.add('faq-div');
        faqDiv.innerHTML = `
            <div class="faq-outer-sec" onclick="handleOpenFaqInnerPanel(\${index})">
               <div>
                <p class="faq-header-text" style="font-weight:700; font-size:medium;">\${faq.header}</p>
                <p class="faq-preview-text" style="font-weight:500; font-size:small;">\${faq.preview}</p>
                <p class="faq-preview-text" style="font-weight:400; font-size:smaller; color:gray">\${faq.qna.length} Answers</p>
                </div>
               <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </div>
            </div>
        `;
        faqAdd.appendChild(faqDiv);
    });
});

function handleOpenFaqInnerPanel(index) {
    console.log("console", index);
    setCurrentFaqQa(index);
    const chatbotChat = document.getElementById('chatbot-panel-4');
    const chatbotPanel = document.getElementById('chatbot-panel-1');
    chatbotPanel.style.display = "none";
    chatbotChat.style.display = "block";
}

function handleStartChat() {
    const chatbotChat = document.getElementById('chatbot-panel-2');
    const chatbotPanel = document.getElementById('chatbot-panel-1');
    chatbotPanel.style.display = "none";
    chatbotChat.style.display = "block";
}

function handleFaqSec() {
    const chatbotChat = document.getElementById('chatbot-panel-3');
    const chatbotPanel = document.getElementById('chatbot-panel-1');
    chatbotPanel.style.display = "none";
    chatbotChat.style.display = "block";
}

function handleFaqBackButton() {
    const dynamicFaqSection = document.getElementById('dynamic-faq-questions');
    dynamicFaqSection.innerHTML = "";
    const faqInnerSec = document.getElementById('chatbot-panel-4');
    faqInnerSec.style.display = "none";
}

function handleBackButton() {
    const currentChat = document.getElementsByClassName('current-chat');
    const homeChat = document.getElementsByClassName('home-chat')[0];
    console.log("going back", currentChat, homeChat);
    Array.from(currentChat).forEach(chat => {
        console.log(chat, "is changing");
        chat.style.display = "none";
    });
    homeChat.style.display = "block";
}

function setCurrentFaqQa(index) {
    const dynamicHeader = document.getElementById('faq-dynamic-panel');
    const dynamicFaqSection = document.getElementById('dynamic-faq-questions');
    var faqHeader = defaultFaq[index].header;
    var currentFaqQna = defaultFaq[index].qna;
    dynamicHeader.innerText = faqHeader;

    currentFaqQna.forEach((faq) => {
        var accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');
        accordionItem.innerHTML = `
            <div class="accordion-header" onclick="toggleAccordion(this)" style="font-weight:500">
                \${faq.question}
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                </span>
            </div>
            <div class="accordion-content">
                <p style="font-weight:300">\${faq.previewAnswer}</p>
            </div>
            <hr style="border:2px solid #F8F7F7">
        `;
        dynamicFaqSection.appendChild(accordionItem);
    });
}

function toggleAccordion(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('show');
    element.classList.toggle('active');
}
</script>

<!-- socket -->
<script>
let uuid = self.crypto.randomUUID();
const embedId = ${chatbotId};
localStorage.setItem('chatbotId', embedId);

console.log(localStorage.getItem('chatbotId'), "embedId");
var currentIndex = -1;

const askQBtn = document.getElementById('ask-q-btn');
askQBtn.addEventListener('click', () => {
    disabledInputField();
    var chatbotSection = document.getElementById('chating-section');
    chatbotSection.innerHTML = `
        <div style="display: flex; gap: 8px;" id="loading">
            <div style="width: fit-content; height: fit-content; padding: 10px 14px; border-radius: 15px; background-color: #D9DADA; font-weight: 300;">
                <div style="display: flex; gap: 3px;">
                    <p class="loading-bar" style="background: black; height: 5px; width: 5px; border-radius: 5px;"></p>
                    <p class="loading-bar" style="background: black; height: 5px; width: 5px; border-radius: 5px;"></p>
                    <p class="loading-bar" style="background: black; height: 5px; width: 5px; border-radius: 5px;"></p>
                </div>
            </div>
        </div>
    ` + chatbotSection.innerHTML;

    var selectedText = document.getElementById('ai-q-field').value;
    var question = selectedText;
    console.log("ask question", question);
    setTimeout(() => sendAskToAiServer(question), 500);
});

function sendAskToAiServer(message) {
    socket.emit('ask-ai', { message, session_id: uuid });
}

function disabledInputField() {
    document.getElementById('ai-q-field').disabled = true;
    document.getElementById('ask-q-btn').disabled = true;
}

function enabledInputField() {
    document.getElementById('ai-q-field').disabled = false;
    document.getElementById('ask-q-btn').disabled = false;
}

function clearAiField() {
    document.getElementById('ai-q-field').value = "";
}

function addAiBotAnswer(answer) {
    const chatbotSection = document.getElementById('chating-section');
    const divElem = document.createElement('div');
    divElem.classList.add('chating-partner-sec');
    divElem.innerHTML = `
        <div style="display: flex; gap: 8px;">
            <div style="width: fit-content; height: fit-content; padding: 10px 14px; border-radius: 15px; background-color: #D9DADA; font-weight: 300;">
                ${answer}
            </div>
        </div>
    `;
    const firstLoadingElem = document.getElementById('loading');
    firstLoadingElem.remove();
    chatbotSection.innerHTML = divElem.outerHTML + chatbotSection.innerHTML;
    enabledInputField();
    clearAiField();
}

const socket = io('http://localhost:8000');
socket.on('ai-response', (data) => {
    console.log("ai-response", data.answer);
    addAiBotAnswer(data.answer);
});
</script>