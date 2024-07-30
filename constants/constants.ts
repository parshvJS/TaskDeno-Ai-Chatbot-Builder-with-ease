export const navItems = [
    {
        route: '/dashboard',
        label: 'Dashboard',
        imgUrl: '/icons/home.svg'
    },
    {
        route: '/appearance',
        label: 'Appearance & theme',
        imgUrl: '/icons/appearance.svg'
    },
    {
        route: '/integration',
        label: 'Integration',
        imgUrl: '/icons/integration.svg'
    },
    {
        route: '/conversation',
        label: 'Conversation',
        imgUrl: '/icons/conversation.svg'
    },
    {
        route: '/leads',
        label: 'Manage Leads',
        imgUrl: '/icons/lead.svg'
    },
    {
        route: '/analytics',
        label: 'Analytics',
        imgUrl: '/icons/analytics.svg'
    },
   
]

export const outerNavItems = [
    {
        route: '/mydenos',
        label: 'My Denos',
        imgUrl: '/icons/mydenos.svg'
    },
    {
        route: '/usage',
        label: 'Usage',
        imgUrl: '/icons/usage.svg'
    },
    {
        route: '/templates',
        label: 'Templates',
        imgUrl: '/icons/templates.svg'
    },
    {
        route: '/documentation',
        label: 'Documentation',
        imgUrl: '/icons/documentation.svg'
    },
    {
        route: '/setting',
        label: 'Setting',
        imgUrl: '/icons/setting.svg'
    },
    // {
    //     route: '/logout',
    //     label: 'Logout',
    //     imgUrl: '/icons/logout.svg'

    // }

]

// items
// AI Configuration
// Variables 
// Setting
export const toggleBarItems = [

    {
        label: "Status & Start",
        imgUrl: "/icons/run.svg"
    },
    {
        label: "Building Blocks",
        imgUrl: "/icons/block.svg"
    },
    {
        label: "AI configuration",
        imgUrl: "/icons/bot.svg"
    },
    {
        label: "Variables",
        imgUrl: "/icons/var.svg"
    },
]

// text 
// phone
// email
// image 
// video
// number
// date / time
// custom form

export const UserInput = [
    {

        label: "Text",
        value: "text",
        imgUrl: "/icons/text.svg",
        initialDatagram: {
            type: "text",
            variable: ""
        }
    },
    {
        label: "Phone",
        value: "phone",
        imgUrl: "/icons/phone.svg",
        initialDatagram: {
            type: "phone",
            variable: ""
        }
    },
    {
        label: "Email",
        value: "email",
        imgUrl: "/icons/email.svg",
        initialDatagram: {
            type: "email",
            variable: ""
        }
    },
    {
        label: "Number",
        value: "number",
        imgUrl: "/icons/number.svg",
        initialDatagram: {
            type: "number",
            variable: ""
        }
    },
    // {
    //     label: "Custom Form",
    //     value: "custom",
    //     imgUrl: "/icons/form.svg",
    //     initialDatagram: {
    //         type: "custom",
    //         content: "",
    //         form: [
    //             {
    //                 label: "Name",
    //                 // type:["text","phone","number","email"],
    //                 type: "Text",
    //                 variable: ""
    //             }
    //         ]
    //     }
    // }
]


export const giveResponse = [
    {
        label: "AI Response",
        value: "text",
        imgUrl: "/icons/text.svg",
        initialDatagram: {
            type: "text",
            aiPrompt: "",
            question: "",
            variable: ""
        }
    },
]

export const sentMessage = [
    {
        label: "Image",
        value: "image",
        imgUrl: "/icons/image.svg",
        initialDatagram: {
            type: "image",
            URL: "",
            variable: ""
        }
    },
    {
        label: "Text",
        value: "text",
        imgUrl: "/icons/text.svg",
        initialDatagram: {
            type: "text",
            content: "",
            variable: ""
        }
    },
    {
        label: "Phone",
        value: "phone",
        imgUrl: "/icons/phone.svg",
        initialDatagram: {
            type: "phone",
            content: "",
            variable: ""
        }
    },
    {
        label: "Email",
        value: "email",
        imgUrl: "/icons/email.svg",
        initialDatagram: {
            type: "email",
            content: "",
            variable: ""
        }
    },
    {
        label: "Number",
        value: "number",
        imgUrl: "/icons/number.svg",
        initialDatagram: {
            type: "number",
            content: "",
            variable: ""
        }
    },

]

export const quickMessage = [
    {
        label: "Button",
        value: "button",
        imgUrl: "/icons/btn.svg"
    }
]

export const openAIModels = [
    {
        label: "GPT-4o",
        value: "gpt-4o"
    },
    {
        label: "GPT-4 Turbo",
        value: "gpt-4-turbo"
    },
    {
        label: "GPT-4",
        value: "gpt-4"
    },
    {
        label: "GPT-3.5 Turbo",
        value: "gpt-3.5-turbo"
    },
    {
        label: "GPT-3.5",
        value: "gpt-3.5"
    }
]

export const defaultFaq = [
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
    },

  ]
