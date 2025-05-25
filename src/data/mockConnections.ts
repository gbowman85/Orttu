export interface Connection {
    id: string;
    serviceId: string;
    ownerId: string;
    viewerIds: string[];
    title: string;
    token: string;
    refreshToken: string;
    created: number;
    updated: number;
    lastUsed: number;
    active: boolean;
}

export const mockConnections: Connection[] = [
    {
        id: 'conn_1',
        serviceId: 'svc_1',
        ownerId: 'user_1',
        viewerIds: ['user_2', 'user_3'],
        title: 'Gmail Integration',
        token: 'oauth2_token_gmail_xyz123',
        refreshToken: 'refresh_token_gmail_abc456',
        created: Date.now() - 7776000000, // 90 days ago
        updated: Date.now() - 172800000,  // 2 days ago
        lastUsed: Date.now() - 172800000,  // 2 days ago
        active: true
    },
    {
        id: 'conn_2',
        serviceId: 'svc_2',
        ownerId: 'user_1',
        viewerIds: ['user_2'],
        title: 'Google Drive',
        token: 'oauth2_token_drive_def789',
        refreshToken: 'refresh_token_drive_ghi012',
        created: Date.now() - 5184000000, // 60 days ago
        updated: Date.now() - 86400000,   // 1 day ago
        lastUsed: Date.now() - 86400000,   // 1 day ago
        active: true
    },
    {
        id: 'conn_3',
        serviceId: 'svc_3',
        ownerId: 'user_2',
        viewerIds: ['user_1', 'user_3'],
        title: 'Sharepoint',
        token: 'oauth2_token_sharepoint_jkl345',
        refreshToken: 'refresh_token_sharepoint_mno678',
        created: Date.now() - 2592000000, // 30 days ago
        updated: Date.now() - 259200000,   // 3 days ago
        lastUsed: Date.now() - 259200000,   // 3 days ago
        active: false
    },
    {
        id: 'conn_4',
        serviceId: 'svc_4',
        ownerId: 'user_1',
        viewerIds: ['user_2', 'user_3', 'user_4'],
        title: 'Google Calendar',
        token: 'oauth2_token_calendar_pqr901',
        refreshToken: 'refresh_token_calendar_stu234',
        created: Date.now() - 1296000000, // 15 days ago
        updated: Date.now() - 43200000,    // 12 hours ago
        lastUsed: Date.now() - 43200000,    // 12 hours ago
        active: true
    },
    {
        id: 'conn_5',
        serviceId: 'svc_5',
        ownerId: 'user_3',
        viewerIds: ['user_1'],
        title: 'Stripe Payments',
        token: 'oauth2_token_stripe_vwx567',
        refreshToken: 'refresh_token_stripe_yza890',
        created: Date.now() - 864000000,  // 10 days ago
        updated: Date.now() - 3600000,     // 1 hour ago
        lastUsed: Date.now() - 3600000,     // 1 hour ago
        active: true
    }
]; 