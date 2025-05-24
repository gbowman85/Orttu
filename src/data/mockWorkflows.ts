export interface Workflow {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'draft' | 'paused';
    starred: boolean;
    enabled: boolean;
    tags: string[];
    created: number;
    updated: number;
}

export const mockWorkflows: Workflow[] = [
    {
        id: '1',
        title: 'Customer Onboarding',
        description: 'New customer registration and welcome sequence',
        status: 'active',
        starred: true,
        enabled: true,
        tags: ['automation', 'customers', 'onboarding'],
        created: 1672531200000, // Jan 1, 2023
        updated: 1675209600000, // Feb 1, 2023
    },
    {
        id: '2',
        title: 'Lead Nurturing',
        description: 'Follow up sequence for new leads',
        status: 'draft',
        starred: false,
        enabled: false,
        tags: ['marketing', 'leads'],
        created: 1680307200000, // Apr 1, 2023
        updated: 1704499200000, // Jan 6, 2024
    },
    {
        id: '3',
        title: 'Support Ticket Router',
        description: 'Automatically route support tickets to correct department',
        status: 'paused',
        starred: true,
        enabled: false,
        tags: ['support', 'automation'],
        created: 1677628800000, // Mar 1, 2023
        updated: 1704758400000, // Jan 9, 2024
    },
    {
        id: '4',
        title: 'Invoice Processing',
        description: 'Process and send invoices to customers',
        status: 'active',
        starred: false,
        enabled: true,
        tags: ['finance', 'automation'],
        created: 1704067200000, // Jan 1, 2024
        updated: 1705017600000, // Jan 12, 2024
    },
    {
        id: '5',
        title: 'Email Campaign Manager',
        description: 'Schedule and track marketing email campaigns',
        status: 'active',
        starred: true,
        enabled: true,
        tags: ['marketing', 'automation', 'email'],
        created: 1682899200000, // May 1, 2023
        updated: 1705276800000, // Jan 15, 2024
    },
    {
        id: '6',
        title: 'Inventory Tracking',
        description: 'Monitor and update product inventory levels',
        status: 'active',
        starred: false,
        enabled: true,
        tags: ['inventory', 'products'],
        created: 1685577600000, // Jun 1, 2023
        updated: 1705536000000, // Jan 18, 2024
    },
    {
        id: '7',
        title: 'Employee Onboarding',
        description: 'New hire documentation and training workflow',
        status: 'draft',
        starred: true,
        enabled: false,
        tags: ['hr', 'onboarding', 'training'],
        created: 1688169600000, // Jul 1, 2023
        updated: 1705795200000, // Jan 21, 2024
    },
    {
        id: '8',
        title: 'Social Media Scheduler',
        description: 'Schedule and publish social media content',
        status: 'paused',
        starred: false,
        enabled: false,
        tags: ['marketing', 'social-media', 'content'],
        created: 1690848000000, // Aug 1, 2023
        updated: 1706054400000, // Jan 24, 2024
    }
]; 