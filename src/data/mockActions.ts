export interface Action {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    borderColor: string;
    backgroundColor: string;
    icon?: string;
}

export const actions: Action[] = [
    {
        id: "set-variable",
        categoryId: "variables",
        title: "Set Variable",
        description: "Create or update a variable with a specific value",
        borderColor: "var(--color-gray-300)",
        backgroundColor: "var(--color-gray-100)"
    },
    {
        id: "get-variable",
        categoryId: "variables",
        title: "Get Variable",
        description: "Retrieve the value of an existing variable",
        borderColor: "var(--color-gray-300)",
        backgroundColor: "var(--color-gray-100)"
    },
    {
        id: "conditional",
        categoryId: "workflow-control",
        title: "If/Else",
        description: "Create a conditional branch in your workflow",
        borderColor: "var(--color-gray-400)",
        backgroundColor: "var(--color-gray-200)"
    },
    {
        id: "loop",
        categoryId: "workflow-control",
        title: "Loop",
        description: "Repeat actions for a specified number of times or condition",
        borderColor: "var(--color-gray-400)",
        backgroundColor: "var(--color-gray-200)"
    },
    {
        id: "concat",
        categoryId: "text",
        title: "Concatenate",
        description: "Join two or more text strings together",
        borderColor: "var(--color-orange-200)",
        backgroundColor: "var(--color-orange-100)"
    },
    {
        id: "format",
        categoryId: "text",
        title: "Format Text",
        description: "Format text with specified rules",
        borderColor: "var(--color-orange-200)",
        backgroundColor: "var(--color-orange-100)"
    },
    {
        id: "send-email",
        categoryId: "gmail",
        title: "Send Email",
        description: "Send an email through Gmail",
        borderColor: "var(--color-red-500)",
        backgroundColor: "var(--color-red-100)"
    },
    {
        id: "read-email",
        categoryId: "gmail",
        title: "Read Email",
        description: "Read emails from Gmail inbox",
        borderColor: "var(--color-red-500)",
        backgroundColor: "var(--color-red-100)"
    },
    {
        id: "create-doc",
        categoryId: "google-docs",
        title: "Create Document",
        description: "Create a new Google Doc",
        borderColor: "var(--color-blue-500)",
        backgroundColor: "var(--color-blue-100)"
    },
    {
        id: "edit-doc",
        categoryId: "google-docs",
        title: "Edit Document",
        description: "Modify an existing Google Doc",
        borderColor: "var(--color-blue-500)",
        backgroundColor: "var(--color-blue-100)"
    }
];

// Simulate a delay for the actions
export const mockActions = () => new Promise<Action[]>((resolve) => {
    setTimeout(() => {
        resolve(actions);
    }, 2000); 
}); 