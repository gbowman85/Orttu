export interface WorkflowRun {
    id: string;
    workflowId: string;
    status: 'completed' | 'failed' | 'running';
    started: number;
    finished: number;
    errorMessage?: string; // Optional errorMessage message for failed runs
}

const workflowRuns: WorkflowRun[] = [
    {
        id: 'run_20',
        workflowId: '6',
        status: 'running',
        started: Date.now() - 300000, // Started 5 minutes ago
        finished: 0 // No finish time for running workflow
    },
    {
        id: 'run_19',
        workflowId: '1',
        status: 'completed',
        started: Date.now() - 3600000, // 1 hour ago
        finished: Date.now() - 3595000 // Completed after 5 minutes
    },
    {
        id: 'run_18',
        workflowId: '5',
        status: 'failed',
        started: Date.now() - 7200000, // 2 hours ago
        finished: Date.now() - 7195000, // Failed after 5 minutes
        errorMessage: 'Task execution timed out after 5 minutes'
    },
    {
        id: 'run_17',
        workflowId: '4',
        status: 'completed',
        started: Date.now() - 14400000, // 4 hours ago
        finished: Date.now() - 14380000 // 20 seconds duration
    },
    {
        id: 'run_16',
        workflowId: '6',
        status: 'completed',
        started: Date.now() - 86400000, // 24 hours ago
        finished: Date.now() - 86395000 // 5 seconds duration
    },
    {
        id: 'run_15',
        workflowId: '1',
        status: 'failed',
        started: Date.now() - 172800000, // 48 hours ago
        finished: Date.now() - 172000000, // Failed after ~13 minutes
        errorMessage: 'Required resource unavailable: Database connection refused'
    },
    {
        id: 'run_14',
        workflowId: '5',
        status: 'completed',
        started: Date.now() - 259200000, // 72 hours ago
        finished: Date.now() - 252000000 // 2 hours duration
    },
    {
        id: 'run_13',
        workflowId: '4',
        status: 'completed',
        started: Date.now() - 345600000, // 96 hours ago
        finished: Date.now() - 345300000 // 5 minutes duration
    },
    {
        id: 'run_12',
        workflowId: '6',
        status: 'completed',
        started: Date.now() - 432000000, // 120 hours ago
        finished: Date.now() - 431700000 // 5 minutes duration
    },
    {
        id: 'run_11',
        workflowId: '1',
        status: 'completed',
        started: Date.now() - 518400000, // 144 hours ago
        finished: Date.now() - 518100000 // 5 minutes duration
    },
    {
        id: 'run_10',
        workflowId: '5',
        status: 'failed',
        started: Date.now() - 604800000, // 168 hours ago
        finished: Date.now() - 604790000, // 10 seconds duration
        errorMessage: 'Invalid input parameters: Missing required field "configuration.targetPath"'
    },
    {
        id: 'run_9',
        workflowId: '4',
        status: 'completed',
        started: Date.now() - 691200000, // 192 hours ago
        finished: Date.now() - 684000000 // 2 hours duration
    },
    {
        id: 'run_8',
        workflowId: '6',
        status: 'completed',
        started: Date.now() - 777600000, // 216 hours ago
        finished: Date.now() - 777300000 // 5 minutes duration
    },
    {
        id: 'run_7',
        workflowId: '1',
        status: 'completed',
        started: Date.now() - 864000000, // 240 hours ago
        finished: Date.now() - 863700000 // 5 minutes duration
    },
    {
        id: 'run_6',
        workflowId: '5',
        status: 'completed',
        started: Date.now() - 950400000, // 264 hours ago
        finished: Date.now() - 950395000 // 5 seconds duration
    },
    {
        id: 'run_5',
        workflowId: '4',
        status: 'completed',
        started: Date.now() - 1036800000, // 288 hours ago
        finished: Date.now() - 1036795000 // 5 seconds duration
    },
    {
        id: 'run_4',
        workflowId: '6',
        status: 'completed',
        started: Date.now() - 1123200000, // 312 hours ago
        finished: Date.now() - 1123195000 // 5 seconds duration
    },
    {
        id: 'run_3',
        workflowId: '1',
        status: 'completed',
        started: Date.now() - 1209600000, // 336 hours ago
        finished: Date.now() - 1209595000 // 5 seconds duration
    },
    {
        id: 'run_2',
        workflowId: '5',
        status: 'completed',
        started: Date.now() - 1296000000, // 360 hours ago
        finished: Date.now() - 1295995000 // 5 seconds duration
    },
    {
        id: 'run_1',
        workflowId: '4',
        status: 'completed',
        started: Date.now() - 1382400000, // 384 hours ago
        finished: Date.now() - 1382395000 // 5 seconds duration
    }
]; 

// Wrap the workflow runs in a Promise that resolves after a delay
export const mockWorkflowRuns = new Promise<WorkflowRun[]>((resolve) => {
    setTimeout(() => {
        resolve(workflowRuns);
    }, 0); // 0 second delay
});