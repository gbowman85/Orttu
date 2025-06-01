export interface Category {
    id: string;
    title: string;
    description?: string;
    color: string;
    textColor: string | null;
    icon: string;
}

export const actionCategories: Category[] = [
    {
        id: "variables",
        title: "Variables",
        description: "Variables are used to store and retrieve data in your workflow",
        color: "var(--color-gray-300)",
        textColor: "var(--color-gray-900)",
        icon: "/images/icons/variables.svg"
    },
    {
        id: "workflow-control",
        title: "Workflow Control",
        description: "Create conditional branches and loops in your workflow",
        color: "var(--color-gray-400)",
        textColor: "var(--color-white)",
        icon: "/images/icons/workflow.svg"
    },
    {
        id: "text",
        title: "Text",
        color: "var(--color-orange-200)",
        textColor: "var(--color-gray-900)",
        icon: "/images/icons/text.svg",
        description: "Text manipulation actions like joining, formatting, and splitting text"
    },
    {
        id: "gmail",
        title: "Gmail",
        color: "var(--color-red-500)",
        textColor: "var(--color-white)",
        icon: "/images/icons/gmail.svg",
        description: "Gmail actions like sending and reading emails"
    },
    {
        id: "google-docs",
        title: "Google Docs",
        color: "var(--color-blue-500)",
        textColor: "var(--color-white)",
        icon: "/images/icons/docs.svg",
        description: "Google Docs actions like creating and editing documents"
    }
];

export const triggerCategories: Category[] = [
    {
        id: "default",
        title: "Default",
        color: "var(--color-green-500)",
        textColor: "var(--color-white)",
        icon: "/images/icons/schedule.svg"
    }, 
    {
        id: "forms",
        title: "Forms",
        color: "var(--color-purple-500)",
        textColor: "var(--color-white)",
        icon: "/images/icons/google-form.svg"
    }
]

// Simulate a delay for the categories
export const mockActionCategories = () => new Promise<Category[]>((resolve) => {
    setTimeout(() => {
        resolve(actionCategories);
    },2000);
}); 