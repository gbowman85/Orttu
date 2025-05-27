export interface UserVariable {
    id: string;
    userId: string;
    title: string;
    dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'datetime';
    value: string;
    created: number;
    updated: number;
}

const userVariables: UserVariable[] = [
    {
        id: 'var_1',
        userId: 'user_1',
        title: 'API Base URL',
        dataType: 'string',
        value: 'https://api.example.com/v1',
        created: Date.now() - 7776000000, // 90 days ago
        updated: Date.now() - 172800000  // 2 days ago
    },
    {
        id: 'var_2',
        userId: 'user_1',
        title: 'Email Template ID',
        dataType: 'string',
        value: 'template_welcome_2024',
        created: Date.now() - 5184000000, // 60 days ago
        updated: Date.now() - 86400000   // 1 day ago
    },
    {
        id: 'var_3',
        userId: 'user_2',
        title: 'Retry Attempts',
        dataType: 'number',
        value: '3',
        created: Date.now() - 2592000000, // 30 days ago
        updated: Date.now() - 259200000   // 3 days ago
    },
    {
        id: 'var_4',
        userId: 'user_1',
        title: 'Notification Recipients',
        dataType: 'array',
        value: '["admin@company.com", "support@company.com"]',
        created: Date.now() - 1296000000, // 15 days ago
        updated: Date.now() - 43200000    // 12 hours ago
    },
    {
        id: 'var_5',
        userId: 'user_3',
        title: 'Debug Mode',
        dataType: 'boolean',
        value: 'true',
        created: Date.now() - 864000000,  // 10 days ago
        updated: Date.now() - 3600000     // 1 hour ago
    },
    {
        id: 'var_6',
        userId: 'user_2',
        title: 'API Rate Limit',
        dataType: 'number',
        value: '100',
        created: Date.now() - 432000000,  // 5 days ago
        updated: Date.now() - 7200000     // 2 hours ago
    },
    {
        id: 'var_7',
        userId: 'user_1',
        title: 'Default Config',
        dataType: 'object',
        value: '{"timeout": 30, "retryEnabled": true, "environment": "production"}',
        created: Date.now() - 345600000,  // 4 days ago
        updated: Date.now() - 14400000    // 4 hours ago
    },
    {
        id: 'var_8',
        userId: 'user_3',
        title: 'Webhook Endpoints',
        dataType: 'array',
        value: '["https://webhook1.example.com", "https://webhook2.example.com"]',
        created: Date.now() - 259200000,  // 3 days ago
        updated: Date.now() - 21600000    // 6 hours ago
    },
    {
        id: 'var_9',
        userId: 'user_2',
        title: 'Company Name',
        dataType: 'string',
        value: 'Acme Corporation',
        created: Date.now() - 172800000,  // 2 days ago
        updated: Date.now() - 28800000    // 8 hours ago
    },
    {
        id: 'var_10',
        userId: 'user_1',
        title: 'Error Handling Config',
        dataType: 'object',
        value: '{"logLevel": "error", "notifyAdmin": true, "retryCount": 5, "backoffStrategy": "exponential"}',
        created: Date.now() - 86400000,   // 1 day ago
        updated: Date.now() - 36000000    // 10 hours ago
    },
    {
        id: 'var_11',
        title: 'Expiry Date',
        dataType: 'date',
        value: '2024-12-31T23:59:59.999Z',
        userId: 'user1',
        created: Date.now() - 86400000,   // 1 day ago
        updated: Date.now() - 36000000    // 10 hours ago
    }
];

// Wrap the user variables in a Promise that resolves after a delay
export const mockUserVariables = new Promise<UserVariable[]>((resolve) => {
    setTimeout(() => {
        resolve(userVariables);
    }, 0); // 0 second delay
}); 