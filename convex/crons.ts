import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check user scheduled workflows every 15 minutes
crons.interval(
    "check user scheduled workflows",
    {minutes: 15},
    internal.data_functions.scheduled_workflows.runScheduledWorkflows
);

export default crons;