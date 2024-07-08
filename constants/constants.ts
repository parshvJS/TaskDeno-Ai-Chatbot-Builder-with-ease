export const navItems = [
    {
        route: '/dashboard',
        label: 'Dashboard',
        imgUrl: '/icons/home.svg'
    },
    {
        route: '/analytics',
        label: 'Analytics',
        imgUrl: '/icons/analytics.svg'
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
        label: "Start",
        imgUrl: "/icons/run.svg"
    },
    {
        label: "items",
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
    {
        label: "Setting",
        imgUrl: "/icons/bolt.svg"
    }
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