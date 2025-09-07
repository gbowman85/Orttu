export default function GuidePage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <h1 className="text-4xl font-bold mb-8">User Guide</h1>

            <div className="prose prose-lg max-w-none space-y-8">
                {/* Introduction */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Getting Started with Workflow Automation</h2>
                    <p className="text-gray-700 leading-relaxed">
                        This platform allows you to create automated workflows that connect different services and applications.
                        You can build workflows that trigger automatically based on events, schedules, or manual actions,
                        then perform a series of actions across various third-party services.
                    </p>
                </section>

                {/* How Workflows Work */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">How Workflows Work</h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Every workflow consists of two main parts:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Trigger:</strong> The event that starts your workflow (manual button, scheduled time, or external event)</li>
                            <li><strong>Actions:</strong> The steps that execute after the trigger (send emails, create files, process data, etc.)</li>
                        </ul>
                    </div>
                </section>

                {/* Creating Workflows */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Creating Your First Workflow</h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-lg font-medium mb-2">Step 1: Sign Up and Connect Services</h3>
                            <p className="text-gray-700">
                                After creating an account, you'll need to connect your third-party services (like Gmail, Google Drive,
                                or other applications) through a secure integration system. This allows workflows to access and
                                interact with your accounts.
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="text-lg font-medium mb-2">Step 2: Choose a Trigger</h3>
                            <p className="text-gray-700">
                                Select how your workflow should start:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                                <li><strong>Manual:</strong> Run the workflow by clicking a button</li>
                                <li><strong>Schedule:</strong> Run at specific times or intervals (daily, weekly, etc.)</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="text-lg font-medium mb-2">Step 3: Add Actions</h3>
                            <p className="text-gray-700">
                                Build your workflow by adding actions that will execute in sequence. Available actions include:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                                <li>Send emails or notifications</li>
                                <li>Create or update files in cloud storage</li>
                                <li>Process and transform data</li>
                                <li>Make API calls to external services</li>
                                <li>Conditional logic (if/then statements)</li>
                                <li>Loops for repeating actions</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <h3 className="text-lg font-medium mb-2">Step 4: Test and Deploy</h3>
                            <p className="text-gray-700">
                                Test your workflow to ensure it works correctly, then enable it to start running automatically
                                based on your trigger settings.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Example Use Cases */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Example Use Cases</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-3 text-blue-900">Customer Onboarding</h3>
                            <p className="text-blue-800 text-sm">
                                Automatically send welcome emails, create user accounts, and set up initial configurations
                                when new customers sign up.
                            </p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-3 text-green-900">Data Processing</h3>
                            <p className="text-green-800 text-sm">
                                Process uploaded files, extract information, and store results in databases or
                                cloud storage automatically.
                            </p>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-3 text-purple-900">Scheduled Reports</h3>
                            <p className="text-purple-800 text-sm">
                                Generate and email weekly reports, backup important files, or perform
                                maintenance tasks on a schedule.
                            </p>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-3 text-orange-900">Support Automation</h3>
                            <p className="text-orange-800 text-sm">
                                Route support tickets to the right department, send acknowledgment emails,
                                and create follow-up tasks automatically.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Monitoring and Management */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Monitoring Your Workflows</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Once your workflows are running, you can monitor their performance through the activity dashboard:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>View execution history and status of all workflow runs</li>
                        <li>See detailed logs and error messages if something goes wrong</li>
                        <li>Monitor performance metrics and execution times</li>
                        <li>Enable or disable workflows as needed</li>
                        <li>Edit and update workflow configurations</li>
                    </ul>
                </section>

                {/* Important Notes */}
                <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Important Notes</h2>
                    <ul className="list-disc list-inside space-y-2 text-yellow-800">
                        <li>This is an academic project - no guarantees are provided regarding reliability or security</li>
                        <li>Always test workflows thoroughly before using them with important data</li>
                        <li>Be cautious when connecting accounts to third-party services</li>
                        <li>Monitor your workflows regularly to ensure they're working as expected</li>
                        <li>Keep your connections secure and up-to-date</li>
                    </ul>
                </section>

                {/* Getting Help */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        If you encounter any issues or have questions about using the platform, please remember that this is
                        an academic demonstration project. While I've built it to be functional, it's primarily designed
                        to showcase workflow automation concepts rather than serve as a production-ready service.
                    </p>
                </section>
            </div>
        </div>
    );
} 