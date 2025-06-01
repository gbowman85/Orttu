export interface Trigger {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    borderColor: string;
    backgroundColor: string;
    icon?: string;
}

export const triggers: Trigger[] = [
    {
        id: "schedule",
        categoryId: "default",
        title: "Schedule",
        borderColor: "var(--color-green-500)",
        backgroundColor: "var(--color-green-200)",
        icon: "/images/icons/schedule.svg",
        description: "Start your workflow at a specific time or on a specific date"
    }, 
    {
        id: "google-form",
        categoryId: "forms",
        title: "Google Form",
        borderColor: "var(--color-purple-500)",
        backgroundColor: "var(--color-purple-200)",
        icon: "/images/icons/google-form.svg",
        description: "Start your workflow when a Google Form is submitted"
    },
    {
        id: "microsoft-form",
        categoryId: "forms",
        title: "Microsoft Form",
        borderColor: "var(--color-teal-500)",
        backgroundColor: "var(--color-teal-200)",
        icon: "/images/icons/microsoft-form.svg",
        description: "Start your workflow when a Microsoft Form is submitted"
    }
];

// Simulate a delay for the triggers
export const mockTriggers = () => new Promise<Trigger[]>((resolve) => {
    setTimeout(() => {
        resolve(triggers);
    }, 100);
}); 